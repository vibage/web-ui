import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { MatDialogRef, MatDialog } from "@angular/material";
import { SigninComponent } from "src/app/account/signin/signin.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
  loginDialogRef: MatDialogRef<SigninComponent>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  listenRedirect() {
    this.router.navigate(["find"]);
  }

  hostRedirect() {
    const loggedIn = this.auth.isLoggedIn();
    if (loggedIn) {
      this.router.navigate(["account"]);
    } else {
      // Bring up the login modal
      this.dialog.open(SigninComponent, { autoFocus: true });
    }
  }
}
