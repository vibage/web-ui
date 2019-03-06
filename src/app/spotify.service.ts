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

  public getToken(): Observable<string> {
    if (SpotifyService.token) {
      return of(SpotifyService.token);
    } else {
      return this.http.get("https://api.tgt101.com/spotify/getToken", {
        responseType: "text"
      });
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
}
