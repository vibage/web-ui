import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private fire: AngularFireAuth,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fire.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['queuer']);
      }
    });
  }

}
