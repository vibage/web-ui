import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, merge, AsyncSubject } from "rxjs";
import { tap, map, switchMap, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Socket } from "ngx-socket-io";
import { ITrack } from ".";
import { AuthService } from "./auth.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class QueueService {
  private baseUrl!: string;

  public currentTrack!: ITrack;

  private player!: Spotify.PlaybackState;
  private playerSocket!: Observable<Spotify.PlaybackState>;

  private _tracks!: ITrack[];
  private tracksSocket!: Observable<ITrack[]>;
  public trackSubject = new AsyncSubject<ITrack[]>();

  private likes!: Set<string>;

  public queueId!: string;

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private auth: AuthService,
    private toaster: ToastrService
  ) {
    this.baseUrl = environment.apiUrl;

    this.playerSocket = this.socket
      .fromEvent<Spotify.PlaybackState>("player")
      .pipe(
        tap(player => console.log(player)),
        tap(player => (this.player = player))
      );

    this.tracksSocket = this.socket
      .fromEvent<ITrack[]>("tracks")
      .pipe(tap(this.trackHandler.bind(this)));
  }

  public setQueueId(queueId: string) {
    console.log(`Setting queue id: ${queueId}`);
    this.socket.emit("myId", queueId);
    this.queueId = queueId;
  }

  public get $tracks() {
    return merge(this.getTracksHttp(), this.tracksSocket, this.trackSubject);
  }

  public getTracksHttp() {
    if (!this.queueId) {
      return;
    }
    return this.http
      .get<ITrack[]>(`${this.baseUrl}/queue/${this.queueId}/tracks`)
      .pipe(tap(this.trackHandler.bind(this)));
  }

  private trackHandler(tracks: ITrack[]) {
    console.log({ tracks });
    this.trackSubject.next(tracks);
    this._tracks = tracks;
  }

  public get $player() {
    if (this.player) {
      return merge(of(this.player), this.playerSocket);
    } else {
      return merge(this.getPlayerHttp(), this.playerSocket);
    }
  }

  public getPlayerHttp() {
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
      return this.auth.getMyLikes().pipe(
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

    return this.http
      .put(`${this.baseUrl}/queue/${this.queueId}/track`, {
        trackId,
        queuerId
      })
      .pipe(
        tap((res: any) => {
          if (res.action === "DTK") {
            this.auth.decrementTokens(res.amount);
          }
        })
      );
  }

  public omnisearch(query: string) {
    const url = `${this.baseUrl}/queue/${this.queueId}/search?q=${query}`;
    return this.http.get<ITrack[]>(url);
  }

  public startQueue(deviceId: string) {
    const url = `${this.baseUrl}/queue/start/`;
    return this.auth.getUser().pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid,
          deviceId
        })
      ),
      tap(data => console.log(data))
    );
  }

  public stopQueue() {
    const url = `${this.baseUrl}/queue/stop`;
    return this.auth.getUser().pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid
        })
      )
    );
  }

  public nextTrack() {
    if (this._tracks.length === 0) {
      this.toaster.error("Queue Empty");
      return of(null);
    }
    return this.http
      .post<ITrack>(`${this.baseUrl}/queue/next/`, {
        uid: this.auth.uid
      })
      .pipe(
        catchError(err => {
          console.log(err);
          this.toaster.error(err.error);
          return of(null);
        })
      );
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
