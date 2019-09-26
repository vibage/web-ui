import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry, MatDialog } from "@angular/material";
import { ITrack, IUser } from "../../services";
import { AuthService } from "../../services/auth.service";
import { QueueService } from "../../services/queue.service";
import { TrackInfoModalComponent } from "./track-info-modal/track-info-modal.component";

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
  @Input() playable!: boolean;
  @Input() addFunc!: (track: ITrack) => void;

  public isLiked = false;
  public showMoreCard = false;
  public userName!: string;

  constructor(
    private auth: AuthService,
    private queueService: QueueService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.registerIcon("delete");
    this.registerIcon("heart");
    this.registerIcon("heart_outline");
    this.registerIcon("play");
    this.registerIcon("add");
    this.registerIcon("more");
    if (this.track.isLiked) {
      this.isLiked = true;
    }
  }

  registerIcon(iconName: string) {
    this.iconRegistry.addSvgIcon(
      iconName,
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `assets/icons/${iconName}.svg`
      )
    );
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

  showMore() {
    this.dialog.open(TrackInfoModalComponent, {
      data: {
        track: this.track,
        removable: this.removable,
        playable: this.playable
      }
    });
  }
}
