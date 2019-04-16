import { Component, OnInit } from "@angular/core";
import { AuthService } from "../spotify/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  public uid: string;
  public name: string;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {}

  googleLogin() {
    this.auth.GoogleAuth().then(({ user }) => {
      console.log(user);
      this.uid = user.uid;
      // see if uid already exists, if so then redirect to account page.

      this.auth.getUserHttp(user.uid).subscribe(
        userRes => {
          if (userRes) {
            // this user already exist
            this.router.navigate(["account"]);
          }
        },
        error => {
          console.log(error);
        }
      );

      if (!this.name) {
        this.name = user.displayName;
      }
    });
  }

  register() {
    this.auth.createUser(this.uid, this.name).subscribe(data => {
      console.log(data);
      this.router.navigate(["account"]);
    });
  }
}
