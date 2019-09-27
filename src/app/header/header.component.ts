import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import {
  MatIconRegistry,
  MatDialogConfig,
  MatDialog,
  MatDialogRef
} from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { SigninComponent } from "../account/signin/signin.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public tokens!: number;

  loginDialogRef: MatDialogRef<SigninComponent>;

  constructor(
    public auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "token",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/token.svg")
    );
  }

  ngOnInit() {
    this.auth.$tokens.subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  goHome() {
    this.router.navigate([""]);
  }

  login() {
    this.dialog.open(SigninComponent, { autoFocus: true });
  }

  logout() {
    this.auth.logout();
    this.router.navigate([""]);
  }

  goToAccount() {
    this.router.navigate(["account"]);
  }
}
