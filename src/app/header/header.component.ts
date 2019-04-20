import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
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

  public openLogin = false;

  constructor(
    public auth: AuthService,
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
    // this.router.navigate(["login"]);
    this.openLogin = true;
  }

  logout() {
    this.auth.logout();
    this.router.navigate([""]);
  }

  goToAccount() {
    this.router.navigate(["account"]);
  }
}
