import { Injectable } from "@angular/core";
import { FeatureFlagService } from "./feature-flags.service";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { ITrack } from ".";

interface IVibageSocketRequest {
  type: "myId";
  myIdPayload?: {
    id: string,
  };
}

interface ISocketMessage {
  type: "tracks" | "player";
  tracksPayload?: ITrack[];
  playerPayload?: Spotify.PlaybackState | null;
}

@Injectable({
  providedIn: "root"
})
export class SocketService {

  private ws!: WebSocketSubject<{}>;

  public tracks$ = new BehaviorSubject<ITrack[]>([]);
  public state$ = new ReplaySubject<Spotify.PlaybackState>(null);

  constructor(features: FeatureFlagService) {
    // super({ url: features.apiUrl, options: {} });
    this.ws = webSocket(features.wsUrl);

    this.ws.asObservable().subscribe((data: ISocketMessage) => {
      switch (data.type) {
        case "tracks":
          this.tracks$.next(data.tracksPayload);
          break;
        case "player":
          this.state$.next(data.playerPayload);
          break;
      }
    });
  }


  sendMessage(message: IVibageSocketRequest) {
    this.ws.next(message);
  }
}
