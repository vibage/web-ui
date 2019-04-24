import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ITrack } from "./index";
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
}
