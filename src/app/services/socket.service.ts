import { Injectable } from "@angular/core";
import { Socket } from "ng-socket-io";
import { FeatureFlagService } from "./feature-flags.service";

@Injectable({
  providedIn: "root"
})
export class SocketService extends Socket {
  constructor(features: FeatureFlagService) {
    super({ url: features.apiUrl, options: {} });
  }
}
