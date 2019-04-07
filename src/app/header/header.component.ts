import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { SpotifyService } from '../spotify/spotify.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public tokens!: number;

  constructor(
    private auth: AuthService,
    private spot: SpotifyService,
    private fire: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.fire.authState.pipe(
      take(1)
    ).subscribe(() => {
      this.spot.getMyTokens().subscribe((tokens: any) => {
        console.log(tokens);
        this.tokens = tokens;
      });
    })

    this.spot.userTokenSubject.subscribe(tokens => {
      this.tokens = tokens;
    })
  }

  login() {
    this.auth.GoogleAuth();
  }

  logout() {
    this.auth.logout();
  }

}
