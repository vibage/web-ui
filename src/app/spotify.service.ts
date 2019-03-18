import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { ITrack } from "./track/track.component";
import { Socket } from "ngx-socket-io";

type HttpMethod = "PUT" | "POST" | "GET";

interface IPlayer {
  status: string;
  is_playing: boolean;
  item: ITrack;
  progress_ms: number;
  shuffle_state: boolean;
}

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  private static token: string;
  private baseUrl!: string;
  private id = "5c8ebbff82e57027dab01ef0";

  public isStarted = false;
  public isPlaying = false;

  constructor(private http: HttpClient, private socket: Socket) {
    this.baseUrl = `${location.protocol}//${location.hostname}:3000`;
    console.log("Base URL", this.baseUrl);

    // set id
    this.socket.emit("myId", this.id);
  }

  public setQueueId(id: string) {
    this.id = id;
  }

  public getTracksSocket() {
    return this.socket.fromEvent("tracks").pipe() as Observable<any>;
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

  public makeRequest(url: string, method: HttpMethod, payload?: Object) {
    return from(this.getToken()).pipe(
      switchMap(token =>
        fetch(`https://api.spotify.com${url}`, {
          body: JSON.stringify(payload),
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          method
        })
      ),
      switchMap(data => data.json())
    );
  }

  public getNearbyUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  public addTrack(id: string) {
    const payload = JSON.stringify({
      id: this.id,
      trackId: id
    });
    return from(this.getToken()).pipe(
      switchMap(token =>
        fetch(`${this.baseUrl}/spotify/addTrack`, {
          body: payload,
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
      )
    );
  }

  public removeTrack(track: ITrack) {
    const payload = JSON.stringify({
      id: this.id,
      uri: track.uri
    });
    return from(this.getToken()).pipe(
      switchMap(token =>
        fetch(`${this.baseUrl}/spotify/removeTrack`, {
          body: payload,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
      )
    );
  }

  public startQueue() {
    this.isStarted = true;
    return this.http.post(`${this.baseUrl}/player/startQueue`, { id: this.id }, {
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
    const ob = !this.isStarted ? this.startQueue :
                this.isPlaying ? this.pause :
                this.play;
    return ob;
  }

  public getQueue() {
    return this.http.get<ITrack[]>(`${this.baseUrl}/spotify/getTracks/${this.id}`);
  }

  public nextSong() {
    return this.http.get(`${this.baseUrl}/spotify/nextTrack/${this.id}`);
  }

  public getPlayer() {
    const url = `${this.baseUrl}/spotify/player/${this.id}`;
    return this.http.get<IPlayer>(url).pipe(
      tap(player => {
        this.isPlaying = player.is_playing;
      }),
    );
  }
}
