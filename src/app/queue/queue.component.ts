import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  public tracks!: any[];

  constructor(private spot: SpotifyService) {}

  ngOnInit(): void {
    this.spot.getQueue().subscribe(data => {
      console.log(data);
      this.tracks = data;
    });
  }

  startMusic() {
    this.spot.makeRequest("/v1/me/player/play", "PUT").subscribe(() => {
      console.log("Music Started");
    });
  }

  stopMusic() {
    this.spot.makeRequest("/v1/me/player/pause", "PUT").subscribe(() => {
      console.log("Music Stopped");
    });
  }
}
