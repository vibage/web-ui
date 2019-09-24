import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { IVibe } from ".";
import { switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { FeatureFlagService } from './feature-flags.service';

@Injectable({
  providedIn: "root"
})
export class VibeService {
  private baseUrl!: string;
  private vibe!: IVibe;

  constructor(private http: HttpClient, private auth: AuthService, features: FeatureFlagService) {
    this.baseUrl = features.apiUrl;
  }

  public getVibe() {
    return this.auth.$user.pipe(
      switchMap(user =>
        this.http.get<IVibe>(`${this.baseUrl}/vibe/${user.currentVibe}`)
      ),
      tap(vibe => (this.vibe = vibe))
    );
  }

  get $vibe() {
    if (this.vibe) {
      return of(this.vibe);
    } else {
      return this.getVibe();
    }
  }

  public getAllVibes() {
    return this.http.get<IVibe[]>(`${this.baseUrl}/vibe/pop`);
  }

  public setVibe(vibeId: string) {
    return this.http.put(`${this.baseUrl}/user/vibe/`, {
      uid: this.auth.uid,
      vibeId
    });
  }

  public setPlaylist(vibeId: string, playlistUrl: string) {
    console.log(playlistUrl);
  }
}
