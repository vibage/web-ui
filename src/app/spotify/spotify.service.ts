import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, BehaviorSubject, merge } from "rxjs";
import { tap, map } from "rxjs/operators";
import { environment } from '../../environments/environment';
import { Socket } from "ngx-socket-io";
import { ITrack } from '.';
import { AuthService, IUser } from '../auth.service';

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  public token: string;
  private baseUrl!: string;

  public clientId = "a7e126eaee8b4c6f9e689a8b3b15efa5";
  public hostId = "5c8ebbff82e57027dab01ef0";

  public currentTrack!: ITrack;
  public isStarted = false;
  public isPlaying = false;

  private player!: Spotify.PlaybackState;
  private tracks!: ITrack[];
  private user!: IUser;

  private playerSocket!: Observable<Spotify.PlaybackState>;
  private tracksSocket!: Observable<ITrack[]>;

  public userTokenSubject = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private auth: AuthService
  ) {
    this.baseUrl = environment.apiUrl;
    console.log("Base URL", this.baseUrl);

    if (localStorage.getItem("hostId")) {
      this.setHostId(localStorage.getItem("hostId"));
    } else {
      this.setHostId("5c8ebbff82e57027dab01ef0");
    }

    this.playerSocket = this.socket.fromEvent<Spotify.PlaybackState>("player").pipe(
      tap(player => console.log(player)),
      tap(player => this.player = player)
    )

    this.tracksSocket = this.socket.fromEvent<ITrack[]>("tracks").pipe(
      tap(tracks => console.log(tracks)),
      tap(tracks => this.tracks = tracks)
    )

  }

  public getMyLikes() {
    const queuerId = this.auth.uid;
    return this.http.get(`${this.baseUrl}/queuer/${queuerId}/likes`);
  }

  public getMyTokens() {
    const queuerId = this.auth.uid;
    return this.http.get(`${this.baseUrl}/queuer/${queuerId}/tokens`).pipe(
      tap((tokens: number) => this.userTokenSubject.next(tokens)),
    );
  }

  public get $player() {
    if (this.player) {
      return merge(
        of(this.player),
        this.playerSocket,
      )
    } else {
       return this.playerSocket
    }
  }

  public get $tracks() {
    return this.tracks ? merge(of(this.tracks), this.tracksSocket) : this.tracksSocket;
  }

  public getAccessToken(): Observable<string> {
    return this.auth.getUser().pipe(
      tap(user => console.log("token", user)),
      map(user => user.accessToken),
      tap(token => console.log(token)),
    );
  }

  public getHosts() {
    return this.http.get(`${this.baseUrl}/nearbyHost`);
  }

  public setHostId(hostId: string) {
    console.log(`Setting Hosting Id: ${hostId}`);
    this.hostId = hostId;
    localStorage.setItem("hostId", hostId);
    this.socket.emit("myId", this.hostId);
  }

  public getHostVibe() {
    return this.http.get(`${this.baseUrl}/host/${this.hostId}/vibe`);
  }

  public setHostExplicit(vibeId: string, explicit: boolean) {
    return this.http.post(`${this.baseUrl}/vibe/${vibeId}/setExplicit`, {
      explicit,
    });
  }

  public addTrack(trackId: string) {
    const queuerId = this.auth.uid;

    return this.http.put(`${this.baseUrl}/spotify/addTrack`,
      {
        hostId: this.hostId,
        trackId,
        queuerId,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    ).pipe(
      tap(() => this.getMyTokens().subscribe()),
    )
  }

  public omnisearch(query: string) {
    const url = `${this.baseUrl}/user/${this.hostId}/search?query=${query}`;
    return this.http.get<ITrack[]>(url);
  }

  public startQueue(deviceId) {
    this.isStarted = true;
    return this.http.post(`${this.baseUrl}/player/startQueue`, { id: this.hostId, deviceId }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  }

  public nextSong() {
    return this.http.get<ITrack>(`${this.baseUrl}/spotify/nextTrack/${this.hostId}`);
  }

  public likeSong(trackId: string) {
    const queuerId = this.auth.uid;
    return this.http.post(`${this.baseUrl}/track/like`, {
      hostId: this.hostId,
      trackId,
      queuerId,
    })
  }

  public unlikeTrack(trackId: string) {
    const queuerId = this.auth.uid;
    return this.http.post(`${this.baseUrl}/track/${trackId}/unlike`, {
      hostId: this.hostId,
      queuerId,
    })
  }
}
