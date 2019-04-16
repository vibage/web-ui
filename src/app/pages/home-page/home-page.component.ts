import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/spotify/auth.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {}

  listenRedirect() {
    this.router.navigate(["find"]);
  }

  hostRedirect() {
    const loggedIn = this.auth.isLoggedIn();
    if (loggedIn) {
      this.router.navigate(["account"]);
    } else {
      this.router.navigate(["login"]);
    }
  }
}
