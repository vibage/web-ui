import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, merge } from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Socket } from "ngx-socket-io";
import { ITrack } from ".";
import { AuthService } from "./auth.service";
import { SpotifyService } from "./spotify.service";

@Injectable({
  providedIn: "root"
})
export class QueueService {
  private baseUrl!: string;

  public currentTrack!: ITrack;

  private player!: Spotify.PlaybackState;
  private playerSocket!: Observable<Spotify.PlaybackState>;

  private likes!: Set<string>;

  public queueId!: string;

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private auth: AuthService,
    private spot: SpotifyService
  ) {
    this.baseUrl = environment.apiUrl;

    this.playerSocket = this.socket
      .fromEvent<Spotify.PlaybackState>("player")
      .pipe(
        tap(player => console.log(player)),
        tap(player => (this.player = player))
      );
  }

  public setQueueId(queueId: string) {
    console.log(`Setting queue id: ${queueId}`);
    this.socket.emit("myId", queueId);
    this.queueId = queueId;
  }

  public get $player() {
    if (this.player) {
      return merge(of(this.player), this.playerSocket);
    } else {
      return merge(this.getPlayerHttp(), this.playerSocket);
    }
  }

  public getPlayerHttp() {
    console.log(this.queueId);

    const url = `${this.baseUrl}/queue/${this.queueId}/player`;
    return this.http
      .get<Spotify.PlaybackState>(url)
      .pipe(tap(player => (this.player = player)));
  }

  public getLikes() {
    if (this.likes) {
      return of(this.likes);
    } else {
      this.likes = new Set();
      return this.spot.getMyLikes().pipe(
        map(likes => {
          for (const like of likes) {
            this.likes.add(like.trackId);
          }
          return this.likes;
        })
      );
    }
  }

  public addTrack(trackId: string) {
    const queuerId = this.auth.uid;

    return this.http.put(`${this.baseUrl}/queue/${this.queueId}/track`, {
      trackId,
      queuerId
    });
  }

  public omnisearch(query: string) {
    const url = `${this.baseUrl}/queue/${this.queueId}/search?q=${query}`;
    return this.http.get<Spotify.Track[]>(url);
  }

  public startQueue(deviceId: string) {
    const url = `${this.baseUrl}/queue/start/`;
    return this.auth.getUser().pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid,
          deviceId
        })
      )
    );
  }

  public nextTrack() {
    return this.http.post<ITrack>(`${this.baseUrl}/queue/next/`, {
      uid: this.auth.uid
    });
  }

  public playTrack(trackId: string) {
    return this.http.put(`${this.baseUrl}/queue/playTrack`, {
      uid: this.auth.uid,
      trackId
    });
  }

  public likeTrack(trackId: string) {
    this.likes.add(trackId);
    const url = `${this.baseUrl}/queue/${this.queueId}/like/${trackId}`;

    return this.http.post(url, {
      uid: this.auth.uid
    });
  }

  public unlikeTrack(trackId: string) {
    this.likes.delete(trackId);
    const url = `${this.baseUrl}/queue/${this.queueId}/unlike/${trackId}`;

    return this.http.post(url, {
      uid: this.auth.uid
    });
  }

  public sendPlayerState(player: Spotify.PlaybackState) {
    return this.http.put(`${this.baseUrl}/queue/state`, {
      uid: this.auth.uid,
      player
    });
  }

  public play() {
    return this.http.put(`${this.baseUrl}/queue/play`, {
      uid: this.auth.uid
    });
  }

  public pause() {
    return this.http.put(`${this.baseUrl}/queue/pause`, {
      uid: this.auth.uid
    });
  }

  public removeTrack(track: ITrack) {
    const url = `${this.baseUrl}/queue/rmTrack/${track._id}`;
    return this.auth.getUser().pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid
        })
      )
    );
  }
}
