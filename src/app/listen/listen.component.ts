import { Component, OnInit, OnDestroy } from "@angular/core";
import { QueueService } from "../services/queue.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-listen",
  templateUrl: "./listen.component.html",
  styleUrls: ["./listen.component.scss"]
})
export class ListenComponent implements OnInit, OnDestroy {
  constructor(private queueService: QueueService) {}

  public elapse!: number;
  private timerInterval!: any;
  public playerState!: Spotify.PlaybackState;

  private queueSubscription!: Subscription;

  ngOnInit() {
    this.queueSubscription = this.queueService.$player.subscribe(
      (player: Spotify.PlaybackState) => {
        clearInterval(this.timerInterval);
        this.playerState = player;
        if (!player) {
          return;
        }
        let { position } = player;

        this.elapse = position;

        console.log({ player });
        if (!player.paused) {
          console.log("Starting timer");
          const intervalTime = 300;
          this.timerInterval = setInterval(() => {
            position += intervalTime;
            this.elapse = position;
          }, intervalTime);
        }
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    this.queueSubscription.unsubscribe();
  }
}
