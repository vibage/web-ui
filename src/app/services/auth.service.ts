import { Injectable } from "@angular/core";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap, switchMap, filter, map, take, shareReplay } from "rxjs/operators";
import { Observable, of, concat, BehaviorSubject, from, forkJoin } from "rxjs";
import { IUser, ILike } from ".";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private baseUrl: string;

  public $user!: Observable<IUser>;
  public likes$!: Observable<ILike[]>;
  public $tokens = new BehaviorSubject<number>(0);

  public uid: string | null = null;

  constructor(private http: HttpClient, private fire: AngularFireAuth) {
    this.baseUrl = environment.apiUrl;

    this.$user = this.fire.authState.pipe(
      filter(user => Boolean(user)),
      switchMap(({ uid }) => this.getUserHttp(uid)),
      shareReplay(1)
    );

    this.likes$ = this.$user.pipe(
      switchMap(user => this.getUserLikesHttp(user)),
      tap(likes => console.log("Likes:", likes)),
      shareReplay(1)
    );

    this.$user.subscribe(user => {
      console.log({ user });
      this.$tokens.next(user.tokens);
      this.uid = user.uid;
    });
  }

  public decrementTokens(amount: number) {
    this.$user.subscribe(user => {
      this.$tokens.next(user.tokens - amount);
    });
  }

  public getAccessToken(): Observable<string> {
    // just always refresh token to begin with?
    // there has to be a better way of doing this

    return this.$user.pipe(
      switchMap(user =>
        this.http.post<IUser>(`${this.baseUrl}/user/refresh`, { uid: user.uid })
      ),
      map(user => user.accessToken)
    );
  }

  public googleLogin() {
    return from(this.AuthLogin(new auth.GoogleAuthProvider())).pipe(
      switchMap(({ user }) => {
        return forkJoin(this.getUserHttp(user.uid), of(user));
      }),
      switchMap(([user, firebaseUser]) => {
        // this means that the user has not been created yet
        if (!user) {
          return this.createUser(this.uid, firebaseUser.displayName);
        }

        return of(user);
      })
    );
  }

  private async AuthLogin(provider) {
    try {
      const result = this.fire.auth.signInWithPopup(provider);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  public getUserData(userId: string) {
    const url = `${this.baseUrl}/user/${userId}/info`;
    return this.http.get<IUser>(url);
  }

  private getUserHttp(uid: string) {
    const url = `${this.baseUrl}/user/${uid}`;
    return this.http.get<IUser>(url);
  }

  private createUser(uid: string, name: string) {
    const url = `${this.baseUrl}/user`;
    const data = {
      uid,
      name
    };
    return this.http.put<IUser>(url, data);
  }

  private getUserLikesHttp(user: IUser) {
    const url = `${this.baseUrl}/user/${user._id}/likes`;
    return this.http.get<ILike[]>(url);
  }

  public logout() {
    this.fire.auth.signOut();
  }

  public isLoggedIn() {
    const { currentUser } = this.fire.auth;
    return Boolean(currentUser);
  }

  public addSpotData(code: string) {
    const url = `${this.baseUrl}/user/spotify`;
    return this.$user.pipe(
      switchMap(({ uid }) =>
        this.http.post<IUser>(url, {
          code,
          uid
        })
      )
    );
  }
}
