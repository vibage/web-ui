import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SpotifyService } from "../spotify.service";

interface IArtist {
  name: string;
}

interface ITrack {
  name: string;
  artists: IArtist[];
  uri: string;
}

@Component({
  selector: "app-track",
  template: `
    <div>
      <p>{{ track.name }} - {{ track.artists[0].name }}</p>
      <button (click)="addTrack()">Add Track</button>
    </div>
  `,
  styleUrls: ["./track.component.scss"]
})
export class TrackComponent implements OnInit {
  @Input() track!: ITrack;
  constructor(private spot: SpotifyService) {}

  ngOnInit() {}

  addTrack() {
    this.spot.addTrack(this.track.uri).subscribe(data => {
      console.log(data);
    });
  }
}
