import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ITrack } from "./index";
import { FeatureFlagService } from "./feature-flags.service";

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

  constructor(private http: HttpClient, features: FeatureFlagService) {
    this.baseUrl = features.apiUrl;
  }

  public getHosts() {
    return this.http.get(`${this.baseUrl}/nearbyHost`);
  }
}
