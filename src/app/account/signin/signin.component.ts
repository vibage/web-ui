import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  public uid: string;
  public name: string;

  @Output() private close = new EventEmitter<void>();

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {}

  closeModal() {
    this.close.emit();
  }

  googleLogin() {
    this.auth.GoogleAuth().then(({ user }) => {
      console.log(user);
      this.uid = user.uid;
      // see if uid already exists, if so then redirect to account page.

      this.auth.getUserHttp(user.uid).subscribe(
        userRes => {
          if (userRes) {
            this.close.emit();
          } else {
            // we need to create the user
            this.auth.createUser(this.uid, user.displayName).subscribe(data => {
              this.close.emit();
            });
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }
}
