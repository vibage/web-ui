import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  public isLoggedIn = false;

  constructor(
    public auth: AuthService,
    private dialogRef: MatDialogRef<SigninComponent>
  ) { }

  ngOnInit() { }

  googleLogin(): void {
    this.auth.googleLogin().subscribe(
      () => {
        this.dialogRef.close();
      },
      error => {
        console.log(error);
      }
    );
  }
}
