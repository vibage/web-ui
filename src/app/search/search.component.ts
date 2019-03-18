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
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;

  public tracks;
  public query: string = "";

  constructor(
    private spot: SpotifyService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      "search",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/search.svg")
    );
  }

  ngAfterViewInit(): void {
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        tap(q => this.query = q),
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
      });
  }
}
