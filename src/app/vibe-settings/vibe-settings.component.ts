import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { IVibe } from '../spotify';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-vibe-settings',
  templateUrl: './vibe-settings.component.html',
  styleUrls: ['./vibe-settings.component.scss']
})
export class VibeSettingsComponent implements OnInit {

  public vibe: IVibe;

  constructor(
    private spot: SpotifyService,
  ) { }

  ngOnInit() {
    this.spot.getHostVibe().subscribe((data: IVibe) => {
      console.log(data);
      this.vibe = data;
    });
  }

  updateExp(data: MatCheckboxChange) {
    this.spot.setHostExplicit(this.vibe._id, data.checked).subscribe((data) => {
      console.log(data);
    })
  }

}
