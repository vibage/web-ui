import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, BehaviorSubject, merge } from "rxjs";
import { tap, map, switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Socket } from "ngx-socket-io";
import { ITrack, ILike, IUser } from ".";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  public token: string;
  private baseUrl!: string;

  public clientId = "a7e126eaee8b4c6f9e689a8b3b15efa5";
  public hostId!: string;

  public currentTrack!: ITrack;
  public isStarted = false;
  public isPlaying = false;

  private player!: Spotify.PlaybackState;

  private playerSocket!: Observable<Spotify.PlaybackState>;

  public userTokenSubject = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private auth: AuthService
  ) {
    this.baseUrl = environment.apiUrl;
    console.log("Base URL", this.baseUrl);

    this.playerSocket = this.socket
      .fromEvent<Spotify.PlaybackState>("player")
      .pipe(
        tap(player => console.log(player)),
        tap(player => (this.player = player))
      );
  }

  public getMyLikes() {
    return this.auth
      .getUser()
      .pipe(
        switchMap(user =>
          this.http.get<ILike[]>(`${this.baseUrl}/user/${user._id}/likes`)
        )
      );
  }

  public getMyTokens() {
    const queuerId = this.auth.uid;
    return this.http
      .get(`${this.baseUrl}/queuer/${queuerId}/tokens`)
      .pipe(tap((tokens: number) => this.userTokenSubject.next(tokens)));
  }

  public getAccessToken(): Observable<string> {
    // just always refresh token to begin with?
    // there has to be a better way of doing this

    return this.auth.getUser().pipe(
      switchMap(user =>
        this.http.post<IUser>(`${this.baseUrl}/user/refresh`, { uid: user.uid })
      ),
      map(user => user.accessToken)
    );
  }

  public getHosts() {
    return this.http.get(`${this.baseUrl}/nearbyHost`);
  }

  public getHostVibe() {
    return this.http.get(`${this.baseUrl}/host/${this.hostId}/vibe`);
  }

  public setHostExplicit(vibeId: string, explicit: boolean) {
    return this.http.post(`${this.baseUrl}/vibe/${vibeId}/setExplicit`, {
      explicit
    });
  }
}
