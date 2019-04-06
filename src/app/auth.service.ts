import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { QueuerService } from './listen/queuer.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SpotifyService } from './spotify/spotify.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string;

  public user: firebase.User;

  constructor(
    private http: HttpClient,
    private fire: AngularFireAuth,
    private queuerService: QueuerService,
  ) {

    this.baseUrl = environment.apiUrl;

    this.fire.authState.subscribe(user => {
      this.user = user;
      console.log(user);

      this.queuerService.setUserToken(user.uid);

      // get user data

      this.http.get(`${this.baseUrl}/queuer/${user.uid}`).subscribe(data => {
        if (!data) {
          this.http.post(`${this.baseUrl}/queuer`, {queuerId: user.uid}).subscribe(data => {
            console.log(data);
          })
        } else {
          console.log(data);
        }
      })

      // if user doesn't exist then create

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
