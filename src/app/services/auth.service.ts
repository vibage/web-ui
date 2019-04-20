import { Injectable } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap, switchMap, filter, map } from "rxjs/operators";
import { Observable, of, concat, BehaviorSubject } from "rxjs";
import { IUser, ILike } from ".";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl: string;
  public user: IUser;

  public $user!: Observable<IUser>;

  public _isLoggedIn!: boolean;

  public $tokens = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private fire: AngularFireAuth) {
    this.baseUrl = environment.apiUrl;

    this.$user = this.fire.authState.pipe(
      tap(user => (this._isLoggedIn = Boolean(user))),
      filter(user => Boolean(user)),
      switchMap(({ uid }) => this.getUserHttp(uid))
    );

    this.$user.subscribe(user => {
      console.log({ user });
      this.$tokens.next(user.tokens);
      this.user = user;
    });
  }

  public getUser() {
    if (this.user) {
      return concat(of(this.user), this.$user);
    } else {
      return this.$user;
    }
  }

  public getMyLikes() {
    return this.getUser().pipe(
      switchMap(user =>
        this.http.get<ILike[]>(`${this.baseUrl}/user/${user._id}/likes`)
      )
    );
  }

  public decrementTokens(amount: number) {
    this.user.tokens -= amount;
    this.$tokens.next(this.user.tokens);
  }

  public getAccessToken(): Observable<string> {
    // just always refresh token to begin with?
    // there has to be a better way of doing this

    return this.getUser().pipe(
      switchMap(user =>
        this.http.post<IUser>(`${this.baseUrl}/user/refresh`, { uid: user.uid })
      ),
      map(user => user.accessToken)
    );
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

  public getUserHttp(uid: string) {
    return this.http.get<IUser>(`${this.baseUrl}/user/${uid}`).pipe(
      tap(user => {
        if (user === null) {
          this.user = null;
        }
      })
    );
  }

  public createUser(uid: string, name: string) {
    return this.http
      .put<IUser>(`${this.baseUrl}/user`, {
        uid,
        name
      })
      .pipe(tap(user => (this.user = user)));
  }

  public logout() {
    this.fire.auth.signOut();
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
