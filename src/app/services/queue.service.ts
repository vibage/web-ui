import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  of,
  merge,
  ReplaySubject,
  BehaviorSubject,
  combineLatest
} from "rxjs";
import { tap, map, switchMap, catchError, shareReplay } from "rxjs/operators";
import { ITrack } from ".";
import { AuthService } from "./auth.service";
import { ToastrService } from "ngx-toastr";
import { FeatureFlagService } from "./feature-flags.service";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: "root"
})
export class QueueService {
  private baseUrl!: string;
  private likes = new Set<string>();

  public tracks$!: Observable<ITrack[]>;

  public player$!: Observable<Spotify.PlaybackState>;
  public queueIdSubject = new ReplaySubject<string>();

  private likes$ = new BehaviorSubject<Set<string>>(new Set());

  public currentTrack!: ITrack;
  public queueId!: string;

  private getTracksHttp() {
    return this.queueIdSubject.pipe(
      switchMap(queueId =>
        this.http.get<ITrack[]>(`${this.baseUrl}/queue/${queueId}/tracks`)
      )
    );
  }

  private getPlayerHttp() {
    return this.queueIdSubject.pipe(
      switchMap(queueId =>
        this.http.get<Spotify.PlaybackState>(
          `${this.baseUrl}/queue/${queueId}/player`
        )
      )
    );
  }

  constructor(
    private http: HttpClient,
    private socket: SocketService,
    private auth: AuthService,
    private toaster: ToastrService,
    features: FeatureFlagService
  ) {
    this.baseUrl = features.apiUrl;

    const playerSocket = this.socket.fromEvent<Spotify.PlaybackState>("player");
    const tracksSocket = this.socket.fromEvent<ITrack[]>("tracks");

    this.tracks$ = combineLatest(
      merge(this.getTracksHttp(), tracksSocket),
      this.likes$
    ).pipe(
      tap(([tracks, likes]) =>
        console.log("Tracks:", tracks, "Likes: ", likes)
      ),
      map(([tracks, likes]) =>
        tracks.map(track => {
          if (likes.has(track._id)) {
            track.isLiked = true;
          }
          return track;
        })
      ),
      shareReplay(1)
    );

    this.auth.likes$.subscribe(likes => {
      const likeSet = new Set<string>();
      for (const like of likes) {
        likeSet.add(like.trackId);
      }

      this.likes = likeSet;
      this.likes$.next(likeSet);
    });

    this.player$ = merge(this.getPlayerHttp(), playerSocket).pipe(
      tap(x => console.log(`Player: ${x}`)),
      shareReplay(1)
    );
  }

  public setQueueId(queueId: string) {
    console.log(`Setting queue id: ${queueId}`);
    this.socket.emit("myId", queueId);
    this.queueId = queueId;
    this.queueIdSubject.next(queueId);
  }

  public addTrack(trackId: string) {
    const queuerId = this.auth.uid;

    return this.http
      .put(`${this.baseUrl}/queue/${this.queueId}/track`, {
        trackId,
        queuerId
      })
      .pipe(
        tap((res: any) => {
          if (res.action === "DTK") {
            // auto-like track that you add

            this.auth.decrementTokens(res.amount);
            this.likes.add(res.track._id);
            this.likes$.next(this.likes);
          }
        })
      );
  }

  public omnisearch(query: string) {
    const url = `${this.baseUrl}/queue/${this.queueId}/search?q=${query}`;
    return this.http.get<ITrack[]>(url);
  }

  public startQueue(deviceId: string) {
    const url = `${this.baseUrl}/queue/start/`;
    return this.auth.$user.pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid,
          deviceId
        })
      ),
      tap(data => console.log(data))
    );
  }

  public stopQueue() {
    const url = `${this.baseUrl}/queue/stop`;
    return this.auth.$user.pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid
        })
      )
    );
  }

  public nextTrack() {
    this.tracks$.subscribe(tracks => {
      if (tracks.length === 0) {
      }
    });
    return this.http
      .post<ITrack>(`${this.baseUrl}/queue/next/`, {
        uid: this.auth.uid
      })
      .pipe(
        catchError(err => {
          console.log(err);
          this.toaster.error(err.error);
          return of(null);
        })
      );
  }

  public resume() {
    return this.http.post(`${this.baseUrl}/queue/resume`, {
      uid: this.auth.uid
    });
  }

  public playTrack(trackId: string) {
    return this.http.put(`${this.baseUrl}/queue/playTrack`, {
      uid: this.auth.uid,
      trackId
    });
  }

  public likeTrack(trackId: string) {
    this.likes.add(trackId);
    this.likes$.next(this.likes);
    const url = `${this.baseUrl}/queue/${this.queueId}/like/${trackId}`;

    return this.http.post(url, {
      uid: this.auth.uid
    });
  }

  public unlikeTrack(trackId: string) {
    this.likes.delete(trackId);
    this.likes$.next(this.likes);
    const url = `${this.baseUrl}/queue/${this.queueId}/unlike/${trackId}`;

    return this.http.post(url, {
      uid: this.auth.uid
    });
  }

  public sendPlayerState(player: Spotify.PlaybackState | null) {
    return this.http.put(`${this.baseUrl}/queue/state`, {
      uid: this.auth.uid,
      player
    });
  }

  public play() {
    return this.http.put(`${this.baseUrl}/queue/play`, {
      uid: this.auth.uid
    });
  }

  public pause() {
    return this.http.put(`${this.baseUrl}/queue/pause`, {
      uid: this.auth.uid
    });
  }

  public removeTrack(track: ITrack) {
    const url = `${this.baseUrl}/queue/rmTrack/${track._id}`;
    return this.auth.$user.pipe(
      switchMap(user =>
        this.http.post(url, {
          uid: user.uid
        })
      )
    );
  }
}
