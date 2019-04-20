import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ITrack, IUser } from ".";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  public token: string;
  private baseUrl!: string;

  public hostId!: string;

  public currentTrack!: ITrack;
  public isStarted = false;
  public isPlaying = false;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseUrl = environment.apiUrl;
    console.log("Base URL", this.baseUrl);
  }

  public getHosts() {
    return this.http.get(`${this.baseUrl}/nearbyHost`);
  }

  public trackMapper(track: Spotify.Track): ITrack {
    const { id, name, artists, uri, duration_ms, album } = track;
    return {
      name,
      album,
      _id: id,
      artist: artists[0].name,
      uri,
      duration_ms
    };
  }
}
