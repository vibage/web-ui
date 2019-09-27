import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { QueueService } from "../../services/queue.service";
import { PlayerService } from "src/app/services/player.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnInit {
  public idLoaded = false;
  public playerState!: Spotify.PlaybackState;
  public elapse = 0;

  constructor(
    private auth: AuthService,
    private queueService: QueueService,
    public playerService: PlayerService
  ) {
    this.auth.$user.subscribe(user => {
      this.queueService.setQueueId(user._id);
      this.idLoaded = true;
      this.playerService.isHost = true;
      // resume player if the player exists
      if (user.player) {
        this.playerService.start();
      }
    });
  }

  ngOnInit() {
    this.playerService.playerState$.subscribe(state => {
      // console.log("player state", state);
      this.playerState = state;
      if (state) {
        this.elapse = state.position;
      }
    });
  }
}
