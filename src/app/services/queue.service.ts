import { Injectable } from "@angular/core";
import {
  Observable,
  of,
  merge,
  ReplaySubject,
  BehaviorSubject,
  combineLatest
} from "rxjs";
import { tap, map, switchMap, catchError, shareReplay, take } from "rxjs/operators";
import { ITrack } from ".";
import { AuthService } from "./auth.service";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "./socket.service";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class QueueService {
  private likes = new Set<string>();

  public tracks$!: Observable<ITrack[]>;

  public player$!: Observable<Spotify.PlaybackState | null>;
  public queueIdSubject = new ReplaySubject<string>();

  private likes$ = new BehaviorSubject<Set<string>>(new Set());

  public currentTrack!: ITrack;
  public queueId!: string;

  private getTracksHttp() {
    return this.queueIdSubject.pipe(
      switchMap(queueId => this.api.getTracks(queueId))
    );
  }

  private getPlayerHttp() {
    return this.queueIdSubject.pipe(
      switchMap(queueId => this.api.getPlayer(queueId))
    );
  }

  constructor(
    private api: ApiService,
    private socket: SocketService,
    private auth: AuthService,
    private toaster: ToastrService,
  ) {
    const playerSocket = this.socket.state$;
    const tracksSocket = this.socket.tracks$;

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

    this.api.likes$.subscribe(likes => {
      const likeSet = new Set<string>();
      for (const like of likes) {
        likeSet.add(like.trackId);
      }

      this.likes = likeSet;
      this.likes$.next(likeSet);
    });

    this.player$ = merge(this.getPlayerHttp(), playerSocket).pipe(
      tap(x => console.log(`Player: `, x)),
      shareReplay(1)
    );
  }

  public setQueueId(queueId: string) {
    console.log(`Setting queue id: ${queueId}`);
    this.socket.sendMessage({
      type: "myId",
      myIdPayload: {
        id: queueId,
      }
    });
    this.queueId = queueId;
    this.queueIdSubject.next(queueId);
  }

  public addTrack(trackId: string) {
    return this.api.addTrack(this.queueId, trackId)
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
    return this.api.search(this.queueId, query);
  }

  public startQueue(deviceId: string) {
    return this.api.startQueue(deviceId);
  }

  public stopQueue() {
    return this.api.stopQueue();
  }

  public nextTrack() {
    this.tracks$.subscribe(tracks => {
      if (tracks.length === 0) {
      }
    });
    return this.api.nextTrack()
      .pipe(
        catchError(err => {
          console.log(err);
          this.toaster.error(err.error);
          return of(null);
        })
      );
  }

  public resume() {
    this.auth.$user.pipe(take(1)).subscribe(user => {
      // Resume the queue if the user used to have a playback state
      if (user.player) {
        console.log("Resuming Queue");
        this.api.resume();
      }
    });
  }

  public playTrack(trackId: string) {
    return this.api.playTrack(trackId);
  }

  public likeTrack(trackId: string) {
    this.likes.add(trackId);
    this.likes$.next(this.likes);

    return this.api.likeTrack(this.queueId, trackId);
  }

  public unlikeTrack(trackId: string) {
    this.likes.delete(trackId);
    this.likes$.next(this.likes);

    return this.api.unlikeTrack(this.queueId, trackId);
  }

  public sendPlayerState(player: Spotify.PlaybackState | null) {
    return this.api.sendPlayerState(player);
  }

  public play() {
    return this.api.play();
  }

  public pause() {
    return this.api.pause();
  }

  public removeTrack(track: ITrack) {
    return this.api.removeTrack(track);
  }
}
