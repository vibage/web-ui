import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FeatureFlagService {
  private features: Set<string> = new Set<string>();

  constructor(private route: ActivatedRoute) {
    const params = new URLSearchParams(window.location.search);
    const mods = params.get("mods");
    if (mods) {
      const modList = mods.split(",");
      for (const mod of modList) {
        this.features.add(mod);
      }
    }
    console.log(this.features);
  }

  has(feature: string) {
    return this.features.has(feature);
  }

  get apiUrl(): string {
    console.log(this.has("local"));
    if (this.has("local")) {
      return "http://localhost:3000";
    } else if (this.has("stage")) {
      return "http://vibage-stage.appspot.com";
    } else {
      return "https://vibage.herokuapp.com";
      // return "http://vibage.appspot.com";
    }
  }
}
