import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FeatureFlagService {
  private features: Set<string> = new Set<string>();

  constructor(private route: ActivatedRoute) {
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    const mods = params.get("mods");
    console.log(mods);
    if (mods) {
      const modList = mods.split(",");
      for (const mod of modList) {
        this.features.add(mod);
      }
    }
  }

  has(feature: string) {
    return this.features.has(feature);
  }

  get apiUrl(): string {
    if (this.has("local")) {
      return "http://localhost:3000";
    } else if (this.has("stage")) {
      return "http://vibage-stage.appspot.com";
    } else {
      return "https://vibage.herokuapp.com";
    }
  }
}
