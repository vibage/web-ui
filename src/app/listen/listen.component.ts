import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
  ) { }

  ngOnInit() {}

  addTrack() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['search']);
    } else {
      alert("Please Login to add songs");
    }
  }

}
