import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, merge } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Socket } from "ngx-socket-io";
import { ITrack } from ".";
import { QueueService } from "./queue.service";

@Injectable({
  providedIn: "root"
})
export class TracksService {
  private baseUrl!: string;

  private _tracks!: ITrack[];
  private tracksSocket!: Observable<ITrack[]>;

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private queueService: QueueService
  ) {
    this.baseUrl = environment.apiUrl;
  }

  public get tracks() {
    return this._tracks;
  }

  public get $tracks() {
    if (this._tracks) {
      return merge(of(this._tracks), this.tracksSocket);
    } else {
      return merge(this.getTracksHttp(), this.tracksSocket);
    }
  }

  public getTracksHttp() {
    return this.http
      .get<ITrack[]>(
        `${this.baseUrl}/queue/${this.queueService.queueId}/tracks`
      )
      .pipe(
        tap(tracks => console.log({ tracks })),
        tap(tracks => (this._tracks = tracks))
      );
  }
}
