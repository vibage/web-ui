import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITrack } from '../spotify';
import { environment } from '../../environments/environment';
import { SpotifyService } from '../spotify/spotify.service';


@Injectable({
  providedIn: "root"
})
export class PlayerService {
  private baseUrl!: string;

  constructor(
    private http: HttpClient,
    private spot: SpotifyService
  ) {
    this.baseUrl = environment.apiUrl;
  }

  public nextTrack() {
    return this.http.get<ITrack>(`${this.baseUrl}/spotify/nextTrack/${this.spot.hostId}`);
  }

  public sendPlayerState(state: Spotify.PlaybackState) {
    console.log("Sending Player State");
    return this.http.put(`${this.baseUrl}/player/state`, {
      id: this.spot.hostId,
      state
    });
  }

  public play() {
    return this.http.put(`${this.baseUrl}/player/play`, { id: this.spot.hostId });
  }

  public pause() {
    return this.http.put(`${this.baseUrl}/player/pause`, { id: this.spot.hostId });
  }

  public removeTrack(track: ITrack) {
    return this.http.post(`${this.baseUrl}/spotify/removeTrack`,
      {
        hostId: this.spot.hostId,
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

}
