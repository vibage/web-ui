import { Component, OnInit } from "@angular/core";
import { AuthService } from "../spotify/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from "../spotify";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  public name!: string;
  public clientId = "a7e126eaee8b4c6f9e689a8b3b15efa5";
  public user!: IUser;
  public hasSpotAuth = false;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.getUser().subscribe(user => {
      if (!user) {
        this.router.navigate(["login"]);
        return;
      }
      this.user = user;
      this.hasSpotAuth = Boolean(this.user.spotifyId);
    });

    const code = this.route.snapshot.queryParamMap.get("code");
    if (code) {
      // authorize with spot
      this.auth.addSpotData(code).subscribe(() => {
        // get rid of the code in the url
        location.assign(`${location.origin}/#/account`);
        this.hasSpotAuth = true;
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
      this.clientId
    }&response_type=code&redirect_uri=${redirect_url}&scope=${scope}&state=34fFT29kd09`;
    location.assign(url);
  }

  public startQueue() {
    this.router.navigate(["host"]);
  }

  public listen() {
    this.router.navigate(["find"]);
  }
}
