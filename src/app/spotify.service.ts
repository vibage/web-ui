import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

type HttpMethod = "PUT" | "POST" | "GET";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  constructor(private http: HttpClient) {}
  public static token: string;
  private baseUrl = "http://localhost:3000";
  private id = "5c85c3b0a402c6226e67074a";

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
      )
    );
  }

  public addTrack(uri: string) {
    const payload = JSON.stringify({
      id: this.id,
      uri
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
}
