import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "src/app/spotify/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/spotify/auth.service";

@Component({
  selector: "app-host-register",
  templateUrl: "./host-register.component.html",
  styleUrls: ["./host-register.component.scss"]
})
export class HostRegisterComponent implements OnInit {
  constructor(
    private spot: SpotifyService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // authorize with spot
    const code = this.route.snapshot.queryParamMap.get("code");
    if (code) {
      this.auth.addSpotData(code).subscribe(data => {
        console.log(data);
      });
    }
  }

  public getCode() {
    const redirect_url = encodeURIComponent("https://fizzle.tgt101.com");
    const permissions = [
      "user-read-private",
      "user-read-email",
      "streaming",
      "user-read-birthdate",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-modify-private"
    ];
    const scope = encodeURIComponent(permissions.join(" "));
    const url = `https://accounts.spotify.com/authorize?client_id=${
      this.spot.clientId
    }&response_type=code&redirect_uri=${redirect_url}&scope=${scope}&state=34fFT29kd09`;
    const formattedUrl = url;
    location.assign(formattedUrl);
  }
}
