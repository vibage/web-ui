import { Component, OnInit, Input } from "@angular/core";
import { SpotifyService } from "../spotify.service";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";

interface IArtist {
  name: string;
}

export interface ITrack {
  name: string;
  artist?: string;
  artists: IArtist[];
  uri: string;
  id: string;
}

@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.scss"]
})
export class TrackComponent implements OnInit {
  @Input() track!: ITrack;
  @Input() addable!: boolean;
  @Input() removable!: boolean;
  constructor(
    private spot: SpotifyService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "delete",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/delete.svg")
    );
  }

  ngOnInit() {}

  addTrack() {
    this.spot.addTrack(this.track.id).subscribe(data => {
      console.log(data);
    });
  }

  removeTrack() {
    this.spot.removeTrack(this.track).subscribe(data => {
      console.log(data);
    });
  }
}
