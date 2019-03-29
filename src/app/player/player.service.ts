import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITrack } from '../spotify';

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private baseUrl!: string;
  private id = "5c8ebbff82e57027dab01ef0";

  constructor(private http: HttpClient) {
    this.baseUrl = `${location.protocol}//${location.hostname}:3000`;
  }

  public nextTrack() {
    return this.http.get<ITrack>(`${this.baseUrl}/spotify/nextTrack/${this.id}`);
  }

  public sendPlayerState(state: Spotify.PlaybackState) {
    console.log("Sending Player State");
    return this.http.put(`${this.baseUrl}/player/state`, {
      id: this.id,
      state
    });
  }

  public play() {
    return this.http.put(`${this.baseUrl}/player/play`, { id: this.id });
  }

  public pause() {
    return this.http.put(`${this.baseUrl}/player/pause`, { id: this.id });
  }

}
