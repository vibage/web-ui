import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class QueuerService {
  public static token: string;
  private id = "5c8ebbff82e57027dab01ef0";

  public userUID!: string;

  constructor(private http: HttpClient) {
  }

  getUserToken() {
    return this.userUID;
  }

  setUserToken(token: string) {
    this.userUID = token;
  }
}
