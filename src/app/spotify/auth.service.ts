import { Injectable } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap, switchMap, filter } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { IUser } from ".";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl: string;
  public user: IUser;

  public $user!: Observable<IUser>;

  public _isLoggedIn!: boolean;

  constructor(private http: HttpClient, private fire: AngularFireAuth) {
    this.baseUrl = environment.apiUrl;

    this.$user = this.fire.authState.pipe(
      tap(user => (this._isLoggedIn = Boolean(user))),
      filter(user => Boolean(user)),
      switchMap(({ uid }) =>
        this.http.get<IUser>(`${this.baseUrl}/user/${uid}`)
      )
    );

    this.$user.subscribe(user => {
      console.log(user);
      this.user = user;
    });
  }

  public getUser() {
    if (this.user) {
      return of(this.user);
    } else {
      return this.$user;
    }
  }

  public GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  public async AuthLogin(provider) {
    try {
      const result = this.fire.auth.signInWithPopup(provider);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  public createUser(uid: string, name: string) {
    return this.http
      .post<IUser>(`${this.baseUrl}/user`, {
        uid,
        name
      })
      .pipe(tap(user => (this.user = user)));
  }

  public logout() {
    this.fire.auth.signOut();
    localStorage.removeItem("user");
  }

  public isLoggedIn() {
    const { currentUser } = this.fire.auth;
    return Boolean(currentUser);
  }

  public get uid() {
    if (!this.user) {
      return null;
    }
    return this.user.uid;
  }

  public addSpotData(code: string) {
    return this.getUser().pipe(
      switchMap(({ uid }) =>
        this.http.post<IUser>(`${this.baseUrl}/user/spotify`, {
          code,
          uid
        })
      ),
      tap(user => (this.user = user))
    );
  }
}
