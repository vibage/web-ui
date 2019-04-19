import { Component, OnInit, Input } from "@angular/core";
import { ITrack } from "../../spotify";
import { TracksService } from "../../spotify/tracks.service";
import { QueueService } from "../../spotify/queue.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  @Input() host!: string;

  public tracks: ITrack[] = [];

  public isHost!: boolean;

  constructor(
    private trackService: TracksService,
    private queueService: QueueService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.queueService.setQueueId(params.id);
      }
    });
  }

  ngOnInit(): void {
    // listen for the tracks
    this.trackService.$tracks.subscribe(tracks => {
      this.queueService.getLikes().subscribe(likes => {
        for (const track of tracks) {
          if (likes.has(track._id)) {
            track.isLiked = true;
          }
        }
        this.tracks = tracks;
      });
    });

    this.isHost = this.host === "true";
  }
}
