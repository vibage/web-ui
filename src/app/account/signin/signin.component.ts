import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  public isLoggedIn = false;

  @Output() private close = new EventEmitter<void>();

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {}

  closeModal() {
    this.close.emit();
  }

  googleLogin(): void {
    this.auth.googleLogin().subscribe(
      () => {
        this.isLoggedIn = true;
        this.close.emit();
      },
      error => {
        console.log(error);
      }
    );
  }
}
