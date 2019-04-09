import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-host-login',
  templateUrl: './host-login.component.html',
  styleUrls: ['./host-login.component.scss']
})
export class HostLoginComponent implements OnInit {

  public hasSpotAuth = false;
  public hasGoogleAuth = false;
  public name = "";
  public code!: string | null;
  public uid!: string;

  constructor(
    private spot: SpotifyService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParamMap.get("code");
    if (this.code) {
      this.hasSpotAuth = true;
    }
  }

  async getCode() {
    const redirect_url = encodeURIComponent("https://fizzle.tgt101.com");
    const scope = encodeURIComponent(
      "user-read-private user-read-email streaming user-read-birthdate user-read-playback-state user-modify-playback-state playlist-modify-private"
    );
    const url =
      `https://accounts.spotify.com/authorize?client_id=${this.spot.clientId}&response_type=code&redirect_uri=${redirect_url}&scope=${scope}&state=34fFT29kd09`
    const formattedUrl = url;
    console.log(JSON.stringify(formattedUrl));
    location.assign(formattedUrl);
  }

  public loginWithGoogle() {
    this.auth.GoogleAuth().then(({ user }) => {
      console.log(user);
      this.uid = user.uid;
      this.hasGoogleAuth = true;
    });
  }

  get canCreateAccount() {
    return this.uid && this.hasGoogleAuth && this.hasSpotAuth && this.name;
  }

  public createHost() {
    if (this.canCreateAccount) {
      this.spot.createHost(this.code, this.uid, this.name).subscribe(
        (data) => {
          console.log(data);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          alert(err.error);
        }
      );
    } else {
      console.log("Form not filled out");
    }
  }
}
