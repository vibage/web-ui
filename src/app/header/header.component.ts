import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SpotifyService } from '../spotify/spotify.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public tokens!: number;

  public isLoggedIn: boolean;

  constructor(
    public auth: AuthService,
    private spot: SpotifyService,
    private fire: AngularFireAuth,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "token",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/token.svg")
    );
  }

  ngOnInit() {
    this.fire.authState.pipe(
      take(1)
    ).subscribe((user: any) => {
      this.isLoggedIn = Boolean(user);
      this.spot.getMyTokens().subscribe((tokens: any) => {
        this.tokens = tokens;
      });
    })

    this.spot.userTokenSubject.subscribe(tokens => {
      this.tokens = tokens;
    })
  }

  login() {
    this.auth.GoogleAuth().then(() => {
      this.isLoggedIn = true;
    });
  }

  logout() {
    this.isLoggedIn = false;
    this.auth.logout();
  }

}
