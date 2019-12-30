import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FeatureFlagService } from "./feature-flags.service";
import { ITrack, IUser, ILike } from ".";
import { AuthService } from "./auth.service";
import { switchMap, tap, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";

export interface IDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private baseUrl!: string;

  public likes$: Observable<ILike[]>;

  private authPost(url: string, options: object = {}) {
    return this.auth.$user.pipe(
      switchMap((user) =>
        this.http.post(url, {
          uid: user.uid,
          ...options,
        })
      )
    );
  }

  private authPut(url: string, options: object = {}) {
    return this.auth.$user.pipe(
      switchMap((user) =>
        this.http.put(url, {
          uid: user.uid,
          ...options,
        })
      )
    );
  }

  constructor(private auth: AuthService, private http: HttpClient, features: FeatureFlagService) {
    this.baseUrl = features.apiUrl;

    this.likes$ = this.auth.$user.pipe(
      switchMap(user => this.getUserLikes(user)),
      tap(likes => console.log(`Likes: ${likes}`)),
      shareReplay(1),
    );
  }


  public getHosts() {
    return this.http.get(`${this.baseUrl}/nearbyHost`);
  }

  public getTracks(queueId: string) {
    return this.http.get<ITrack[]>(`${this.baseUrl}/queue/${queueId}/tracks`);
  }

  public getPlayer(queueId: string) {
    return this.http.get<Spotify.PlaybackState>(`${this.baseUrl}/queue/${queueId}/player`);
  }

  public getDevices() {
    return this.auth.$user.pipe(
      switchMap(user => this.http.get<IDevice[]>(`${this.baseUrl}/user/${user.uid}/devices`)),
    );
  }

  public getUserLikes(user: IUser) {
    const url = `${this.baseUrl}/user/${user._id}/likes`;
    return this.http.get<ILike[]>(url);
  }

  public search(queueId: string, query: string) {
    const url = `${this.baseUrl}/queue/${queueId}/search?q=${query}`;
    return this.http.get<ITrack[]>(url);
  }

  public likeTrack(queueId: string, trackId: string) {
    const url = `${this.baseUrl}/queue/${queueId}/like/${trackId}`;
    return this.authPost(url);
  }

  public unlikeTrack(queueId: string, trackId: string) {
    const url = `${this.baseUrl}/queue/${queueId}/unlike/${trackId}`;
    return this.authPost(url);
  }

  public addTrack(queueId: string, trackId: string) {
    const url = `${this.baseUrl}/queue/${queueId}/track`;
    return this.auth.$user.pipe(
      switchMap(user =>
        this.http.put(url, {
          trackId,
          queuerId: user.uid
        })
      )
    );
  }

  // Host Functions

  public startVibage() {
    const url = `${this.baseUrl}/vibage/start`;
    return this.authPost(url);
  }

  public stopVibage() {
    const url = `${this.baseUrl}/vibage/stop`;
    return this.authPost(url);
  }

  public startQueue(deviceId: string) {
    const url = `${this.baseUrl}/queue/start/`;
    return this.authPost(url, {
      deviceId,
    }).pipe(
      tap(data => console.log(data)),
    );
  }

  public stopQueue() {
    const url = `${this.baseUrl}/queue/stop`;
    return this.authPost(url);
  }

  public nextTrack() {
    const url = `${this.baseUrl}/queue/next`;
    return this.authPost(url);
  }

  public play() {
    const url = `${this.baseUrl}/queue/play`;
    return this.authPut(url);
  }

  public resume() {
    const url = `${this.baseUrl}/queue/resume`;
    return this.authPost(url);
  }

  public playTrack(trackId: string) {
    const url = `${this.baseUrl}/queue/playTrack`;
    return this.authPut(url, { trackId });
  }

  public pause() {
    const url = `${this.baseUrl}/queue/pause`;
    return this.authPut(url);
  }

  public removeTrack(track: ITrack) {
    const url = `${this.baseUrl}/queue/rmTrack/${track._id}`;
    return this.authPost(url);
  }

  public sendPlayerState(player: Spotify.PlaybackState | null) {
    const url = `${this.baseUrl}/queue/state`;
    return this.authPost(url, {
      player
    });
  }
}
