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
    private playerService: PlayerService
  ) {
    this.auth.getUser().subscribe(user => {
      this.queueService.setQueueId(user._id);
      this.idLoaded = true;
    });
  }

  ngOnInit() {
    this.playerService.$playerState.subscribe(state => {
      if (!state) {
        return;
      }
      this.elapse = state.position;
      this.playerState = state;
    });
  }
}
