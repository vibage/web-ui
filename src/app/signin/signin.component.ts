import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public uid: string;
  public name: string;

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {}

  googleLogin() {
    this.auth.GoogleAuth().then(({ user }) => {
      console.log(user);
      this.uid = user.uid;
      if (!this.name) {
        this.name = user.displayName;
      }
    });
  }

  register() {
    this.auth.createUser(this.uid, this.name).subscribe((data) => {
      console.log(data);
    });
  }

}
