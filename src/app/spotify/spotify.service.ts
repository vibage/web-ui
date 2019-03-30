import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, BehaviorSubject, interval } from "rxjs";
import { tap, take, takeWhile } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { Socket } from "ngx-socket-io";
import { ITrack, IPlayer } from '.';

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  public static token: string;
  private baseUrl!: string;
  private id = "5c8ebbff82e57027dab01ef0";

  public currentTrack!: ITrack;
  public isStarted = false;
  public isPlaying = false;

  public player!: IPlayer;

  public playerSubject = new BehaviorSubject<IPlayer | null>(null);

  constructor(private http: HttpClient, private socket: Socket) {
    this.baseUrl = environment.apiUrl;

    console.log("Base URL", this.baseUrl);

    // set id
    this.socket.emit("myId", this.id);
  }

  public setQueueId(id: string) {
    this.id = id;
  }

  public getTracksSocket() {
    return this.socket.fromEvent("tracks") as Observable<any>;
  }

  public getPlayerSocket() {
    return this.socket.fromEvent("player") as Observable<any>;
  }

  public getToken(): Observable<string> {
    if (SpotifyService.token) {
      return of(SpotifyService.token);
    } else {
      return this.http
        .get(`${this.baseUrl}/spotify/getToken/${this.id}`, {
          responseType: "text"
        })
        .pipe(tap(token => (SpotifyService.token = token)));
    }
  }

  public getNearbyUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  public addTrack(trackId: string) {
    return this.http.put(`${this.baseUrl}/spotify/addTrack`,
      {
        id: this.id,
        trackId
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
  }

  public removeTrack(track: ITrack) {
    return this.http.post(`${this.baseUrl}/spotify/removeTrack`,
      {
        id: this.id,
        uri: track.uri
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
  }

  public omnisearch(query: string) {
    const url = `${this.baseUrl}/user/${this.id}/search?query=${query}`;
    return this.http.get<ITrack[]>(url);
  }

  public startQueue(deviceId) {
    this.isStarted = true;
    return this.http.post(`${this.baseUrl}/player/startQueue`, { id: this.id, deviceId }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  }

  public play() {
    this.isPlaying = true;
    return this.http.put(`${this.baseUrl}/player/play`, { id: this.id });
  }

  public pause() {
    this.isPlaying = false;
    return this.http.put(`${this.baseUrl}/player/pause`, { id: this.id });
  }

  // determine if we should start, play, or pause the queue
  public playPause() {
    const ob = this.isPlaying ? this.pause : this.play;
    return ob.bind(this).call();
  }

  public getQueue() {
    return this.http.get<ITrack[]>(`${this.baseUrl}/spotify/getTracks/${this.id}`);
  }

  public nextSong() {
    return this.http.get<ITrack>(`${this.baseUrl}/spotify/nextTrack/${this.id}`);
  }

  public likeSong(trackUri: string) {
    return this.http.post(`${this.baseUrl}/track/like`, {
      id: this.id,
      trackUri
    })
  }

  public getPlayerUntilChange(): Promise<void> {
    return new Promise(resolve => {
      let go = true;
      const timestamp = (this.player) ? this.player.timestamp : '';

      interval(2000).pipe(
        take(5),
        takeWhile(() => go),
        tap(() => this.getPlayer())
      ).subscribe();

      this.playerSubject.subscribe(player => {
        if (player && player.timestamp != timestamp) {
          go = false;
          resolve();
        }
      });
    })
  }

  public getPlayer(): void {
    const url = `${this.baseUrl}/player/${this.id}`;
    this.http.get<IPlayer>(url).subscribe(
      player => {
      // this.player = player;
      // this.isPlaying = player.is_playing;
      // this.currentTrack = player.item ? player.item : null;

      // if (player.status === "204" || !player.item) {
      //   this.isStarted = false;
      //   this.playerSubject.next(null);
      // } else {
      //   this.isStarted = true;
      //   this.playerSubject.next(player);
      // }

      }
    )
  }
}