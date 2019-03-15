import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { switchMap, tap, map } from "rxjs/operators";
import { ITrack } from "./track/track.component";
import { environment } from "../environments/environment";
import { Socket } from "ngx-socket-io";

type HttpMethod = "PUT" | "POST" | "GET";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  private static token: string;
  private baseUrl!: string;
  private id = "5c85c3b0a402c6226e67074a";

  constructor(private http: HttpClient, private socket: Socket) {
    const { production } = environment;
    if (production) {
      this.baseUrl = location.origin;
    } else {
      this.baseUrl = "http://localhost:3000";
    }

    // set id
    this.socket.emit("myId", this.id);
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
    console.log(url);
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

  public play() {
    fetch(`${this.baseUrl}/spotify/play`, {
      body: JSON.stringify({
        id: this.id
      }),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  }

  public getQueue() {
    return from(fetch(`${this.baseUrl}/spotify/getTracks/${this.id}`)).pipe(
      switchMap(data => data.json())
    );
  }

  public nextSong() {
    return from(fetch(`${this.baseUrl}/spotify/nextTrack/${this.id}`)).pipe(
      switchMap(data => data.json())
    );
  }

  public getPlayer() {
    const url = `${this.baseUrl}/spotify/player/${this.id}`;
    return from(fetch(url)).pipe(switchMap(data => data.json()));
  }
}
