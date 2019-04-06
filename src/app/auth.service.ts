import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: firebase.User;

  constructor(
    private fire: AngularFireAuth,
  ) {
    this.fire.authState.subscribe(user => {
      this.user = user;
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  public GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider())
  }

  public async AuthLogin(provider) {
    try {
      const result = this.fire.auth.signInWithPopup(provider);
      console.log(result);
    } catch(err) {
      console.log(err);
    }
  }

  public getUser() {
    return this.fire.auth.currentUser;
  }

  public getUserId() {
    const { currentUser } = this.fire.auth;
    if (currentUser) {
      return currentUser.uid;
    } else {
      return null;
    }
  }
}
