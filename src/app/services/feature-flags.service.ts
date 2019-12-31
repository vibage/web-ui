import { Injectable } from "@angular/core";

function getFeaturesFromLocalStorage(): string[] {
  return localStorage.getItem("features")
    ? JSON.parse(localStorage.getItem("features"))
    : [];
}

(window as any).getFeatures = (): Set<string> => {
  return new Set(getFeaturesFromLocalStorage());
};

(window as any).addFeature = (feature: string) => {
  const features = getFeaturesFromLocalStorage();
  features.push(feature);
  localStorage.setItem("features", JSON.stringify(features));
};

(window as any).removeFeature = (feature: string) => {
  const features = getFeaturesFromLocalStorage().filter(
    name => feature !== name
  );
  localStorage.setItem("features", JSON.stringify(features));
};

@Injectable({
  providedIn: "root"
})
export class FeatureFlagService {
  private features: Set<string> = new Set<string>();

  constructor() {
    this.features = new Set(getFeaturesFromLocalStorage());
    console.log(this.features);
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
      return "https://api.tgt101.com";
    }
  }

  get wsUrl(): string {
    if (this.has("local")) {
      return "ws://localhost:3000";
    } else {
      return "wss://api.tgt101.com";
    }
  }



}
