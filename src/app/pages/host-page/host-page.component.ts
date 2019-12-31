import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { QueueService } from "../../services/queue.service";
import { PlayerService } from "src/app/services/player.service";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-host-page",
  templateUrl: "./host-page.component.html",
  styleUrls: ["./host-page.component.scss"]
})
export class HostPageComponent {
  public idLoaded = false;
  public playerState!: Spotify.PlaybackState;
  public elapse = 0;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private queueService: QueueService,
    public playerService: PlayerService
  ) {
    this.auth.$user.subscribe(user => {
      this.queueService.setQueueId(user._id);
      this.idLoaded = true;
      this.playerService.isHost = true;
    });
  }

  startVibage(deviceId: string) {
    this.api.startVibage().subscribe(() => {
      console.log("Vibage Started");
    });
  }

}
