import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FeatureFlagService {
  constructor(private route: ActivatedRoute) {}

  private features: Set<string> = new Set<string>();

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mods = params.get("mods").split(",");
      for (let i = 0; i < mods.length; i++) {
        this.features.add(mods[i]);
      }
    });
  }

  has(feature: string) {
    return this.features.has(feature);
  }

  get apiUrl(): string {
    if (this.has("local")) {
      return "localhost:3000";
    } else if (this.has("stage")) {
      return "vibage-stage.appspot.com";
    } else {
      return "vibage.appspot.com";
    }
  }
}
