import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { IVibe } from ".";
import { switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class VibeService {
  private vibe!: IVibe;

  constructor(private auth: AuthService, private api: ApiService) {
  }

  public getVibe() {
    return this.auth.$user.pipe(
      switchMap(user => this.api.getVibe(user.currentVibe)),
      tap(vibe => (this.vibe = vibe)),
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
    return this.api.getAllVibes();
  }

  public setVibe(vibeId: string) {
    return this.api.setVibe(vibeId);
  }

  public setPlaylist(vibeId: string, playlistUrl: string) {
    console.log(playlistUrl);
  }
}
