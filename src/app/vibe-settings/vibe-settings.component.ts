import { Component, OnInit } from "@angular/core";
import { IVibe } from "../services";
import { VibeService } from "../services/vibe.service";

@Component({
  selector: "app-vibe-settings",
  templateUrl: "./vibe-settings.component.html",
  styleUrls: ["./vibe-settings.component.scss"]
})
export class VibeSettingsComponent implements OnInit {
  public currentVibe!: IVibe;

  public allVibes!: IVibe[];

  constructor(private vibeService: VibeService) {}

  ngOnInit() {
    this.vibeService.getVibe().subscribe(currentVibe => {
      this.currentVibe = currentVibe;
    });

    this.vibeService.getAllVibes().subscribe(vibes => {
      this.allVibes = vibes;
    });
  }

  selectVibe(vibe: IVibe) {
    this.currentVibe = vibe;
    this.vibeService.setVibe(vibe._id).subscribe(data => {
      console.log(data);
    });
  }
}
