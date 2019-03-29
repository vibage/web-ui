import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";

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
      this.tracks = data;
    });

    this.spot.getTracksSocket().subscribe(data => {
      this.tracks = data;
      console.log(data);
    });
  }
}
