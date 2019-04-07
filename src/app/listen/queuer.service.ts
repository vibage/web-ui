import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class QueuerService {
  public static token: string;

  public userUID!: string;

  constructor(
    private router: Router,
  ) {
    const userData = localStorage.getItem("user");
    if (!userData) {
      this.router.navigate(['login']);
    }
  }

  getUserToken() {
    return this.userUID;
  }

  setUserToken(token: string) {
    this.userUID = token;
  }
}
