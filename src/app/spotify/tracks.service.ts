import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, merge } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Socket } from "ngx-socket-io";
import { ITrack } from ".";
import { SpotifyService } from "./spotify.service";

@Injectable({
  providedIn: "root"
})
export class TracksService {
  private baseUrl!: string;

  private tracks!: ITrack[];
  private tracksSocket!: Observable<ITrack[]>;

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private spot: SpotifyService
  ) {
    this.baseUrl = environment.apiUrl;

    this.tracksSocket = this.socket.fromEvent<ITrack[]>("tracks").pipe(
      tap(tracks => console.log(tracks)),
      tap(tracks => (this.tracks = tracks))
    );
  }

  public get $tracks() {
    if (this.tracks) {
      return merge(of(this.tracks), this.tracksSocket);
    } else {
      return merge(this.getTracksHttp(), this.tracksSocket);
    }
  }

  public getTracksHttp() {
    return this.http
      .get<ITrack[]>(`${this.baseUrl}/queue/${this.spot.hostId}/tracks`)
      .pipe(
        tap(tracks => console.log(tracks)),
        tap(tracks => (this.tracks = tracks))
      );
  }
}
