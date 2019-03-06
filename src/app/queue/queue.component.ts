import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { SpotifyService } from "../spotify.service";
import {
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  tap
} from "rxjs/operators";
import { fromEvent } from "rxjs";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;
  // private id = "5c7c71ad8ea27f3ec3be2bf3";

  constructor(private spot: SpotifyService) {}

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(q => q.length > 0),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(q =>
          this.spot.makeRequest(
            `/v1/search?q=${q}&type=album,artist,track`,
            "GET"
          )
        ),
        switchMap(res => res.json())
      )
      .subscribe(x => console.log(x));
  }

  startMusic() {
    this.spot.makeRequest("/v1/me/player/play", "PUT").subscribe(() => {
      console.log("Music Started");
    });
  }

  stopMusic() {
    this.spot.makeRequest("/v1/me/player/pause", "PUT").subscribe(() => {
      console.log("Music Stopped");
    });
  }
}
