import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { SpotifyService } from "../spotify.service";
import {
  switchMap,
  filter,
  debounceTime,
  distinctUntilChanged,
  map
} from "rxjs/operators";
import { fromEvent } from "rxjs";

@Component({
  selector: "app-search",
  template: `
    <input type="text" #searchInput />
    <div #results *ngFor="let track of tracks">
      <app-track [track]="track" [addable]="true"></app-track>
    </div>
  `,
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;
  @ViewChild("results") results: ElementRef;

  public tracks;

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
        map(data => data.tracks.items)
      )
      .subscribe(x => {
        this.tracks = x;
        // console.log(x);
        // const html = x.map(data => {
        //   return `<div>${data.name}</div>`;
        // });
        // this.results.nativeElement.innerHTML = html.join("");
      });
  }
}
