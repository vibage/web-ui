import { Component, OnInit } from "@angular/core";
import { AuthService } from "../spotify/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SpotifyService } from "../spotify/spotify.service";
import { IUser } from "../spotify";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  public name!: string;

  public user!: IUser;

  constructor(
    private auth: AuthService,
    private spot: SpotifyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      this.user = user;
    });
    const code = this.route.snapshot.queryParamMap.get("code");
    console.log(code);
    if (code) {
      // authorize with spot
      this.auth.addSpotData(code).subscribe(data => {
        console.log(data);
        location.assign(`${location.origin}/#/account`);
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

  public startQueue() {
    this.router.navigate(["host"]);
  }
}
