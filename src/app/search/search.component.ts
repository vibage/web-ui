import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { SpotifyService } from "../spotify/spotify.service";
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
import { ITrack } from '../spotify';
import { Router } from '@angular/router';

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;

  public tracks!: ITrack;
  public query: string = "";

  public previewTrack!: ITrack;

  constructor(
    private spot: SpotifyService,
    private router: Router,
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
        switchMap(q => this.spot.omnisearch(q)),
        tap(x => console.log(x)),
        map((data: any) => data.tracks.items)
      )
      .subscribe(x => {
        console.log(x);
        this.tracks = x;
      });
  }

  selectTrack(track: ITrack) {
    this.query = "";
    this.previewTrack = track;
    console.log(this.previewTrack);
  }

  addTrack() {
    this.spot.addTrack(this.previewTrack.id).subscribe(data => {
      console.log(data);
    });
    this.router.navigate(['queuer']);
  }
}
