import { Component, OnInit } from "@angular/core";
import { AuthService } from "../spotify/auth.service";
import { SpotifyService } from "../spotify/spotify.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public tokens!: number;

  constructor(
    public auth: AuthService,
    private spot: SpotifyService,
    private fire: AngularFireAuth,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "token",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/token.svg")
    );
  }

  ngOnInit() {
    // this.fire.authState.subscribe((user: any) => {
    //   this.spot.getMyTokens().subscribe((tokens: any) => {
    //     this.tokens = tokens;
    //   });
    // })
    // this.spot.userTokenSubject.subscribe(tokens => {
    //   this.tokens = tokens;
    // })
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  login() {
    this.auth.GoogleAuth().then(() => {
      alert("Authed");
    });
  }

  logout() {
    this.auth.logout();
  }

  goToAccount() {
    this.router.navigate(["account"]);
  }
}
