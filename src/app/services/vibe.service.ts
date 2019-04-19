import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import { IVibe } from ".";
import { map, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class VibeService {
  private baseUrl!: string;
  private vibe!: IVibe;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseUrl = environment.apiUrl;
  }

  public getVibe() {
    return this.auth
      .getUser()
      .pipe(
        switchMap(user =>
          this.http.get<IVibe>(
            `${this.baseUrl}/vibe/${this.auth.user.currentVibe}`
          )
        )
      );
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
}
