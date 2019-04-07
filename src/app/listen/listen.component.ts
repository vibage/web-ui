import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {

  constructor(
    private router: Router,
    private fire: AngularFireAuth,
  ) { }

  ngOnInit() {
    const userData = localStorage.getItem("user");
    if (!userData) {
      this.router.navigate(['login']);
    }

    this.fire.authState.subscribe(user => {
      if (!user) {
        this.router.navigate(['login']);
      }
    });
  }

}
