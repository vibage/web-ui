import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string;

  public user: firebase.User;

  constructor(
    private http: HttpClient,
    private fire: AngularFireAuth,
  ) {

    this.baseUrl = environment.apiUrl;

    this.fire.authState.subscribe(user => {
      this.user = user;

      if (!user) {
        localStorage.removeItem("user");
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));

      console.log(user);

      this.http.get(`${this.baseUrl}/queuer/${user.uid}`).subscribe(data => {
        if (!data) {
          this.http.post(`${this.baseUrl}/queuer`, {queuerId: user.uid}).subscribe(data => {
            console.log(data);
          })
        } else {
          console.log(data);
        }
      })

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

  public logout() {
    this.fire.auth.signOut();
    localStorage.removeItem("user");
  }

  public getUserId() {
    const { currentUser } = this.fire.auth;
    if (currentUser) {
      return currentUser.uid;
    } else {
      return null;
    }
  }

  public isLoggedIn() {
    const { currentUser } = this.fire.auth;
    return Boolean(currentUser);
  }
}
