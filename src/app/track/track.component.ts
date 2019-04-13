import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";
import { ITrack } from "../spotify";
import { AuthService } from "../spotify/auth.service";
import { QueueService } from "../spotify/queue.service";

@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.scss"]
})
export class TrackComponent implements OnInit {
  @Input() track!: ITrack;
  @Input() addable!: boolean;
  @Input() removable!: boolean;
  @Input() likeable!: boolean;
  @Input() addFunc!: (track: ITrack) => void;

  public isLiked = false;

  constructor(
    private auth: AuthService,
    private queueService: QueueService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.iconRegistry.addSvgIcon(
      "delete",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/icons/delete.svg")
    );
    this.iconRegistry.addSvgIcon(
      "heart",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/icons/heart.svg")
    );
    this.iconRegistry.addSvgIcon(
      "heart_outline",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/icons/heart_outline.svg"
      )
    );
    if (this.track.isLiked) {
      this.isLiked = true;
    }
  }

  add() {
    this.addFunc(this.track);
  }

  toggleLike() {
    if (!this.auth.isLoggedIn()) {
      alert("Please log in to like songs");
      return;
    }
    this.isLiked = !this.isLiked;

    if (this.isLiked) {
      this.queueService.likeTrack(this.track._id).subscribe();
    } else {
      this.queueService.unlikeTrack(this.track._id).subscribe();
    }
  }

  remove() {
    this.queueService.removeTrack(this.track).subscribe(data => {
      console.log(data);
    });
  }
}
