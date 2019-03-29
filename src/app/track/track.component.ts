import { Component, OnInit, Input } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";
import { ITrack } from '../spotify';

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

  private isLiked = false;

  constructor(
    private spot: SpotifyService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "delete",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/delete.svg")
    );
    iconRegistry.addSvgIcon(
      "heart",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/heart.svg")
    );
    iconRegistry.addSvgIcon(
      "heart_outline",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/heart_outline.svg")
    );
  }

  ngOnInit() {}

  add() {
    this.spot.addTrack(this.track.id).subscribe(data => {
      console.log(data);
    });
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    // send request
    if (this.isLiked) {
      this.spot.likeSong(this.track.uri).subscribe(res => {
        console.log(res);
      })
    }
  }

  remove() {
    this.spot.removeTrack(this.track).subscribe(data => {
      console.log(data);
    });
  }
}
