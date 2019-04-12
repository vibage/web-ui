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
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { ITrack } from "../spotify";
import { Location } from "@angular/common";
import { QueueService } from "../spotify/queue.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;

  public tracks!: ITrack;
  public query = "";

  public previewTrack!: ITrack;

  constructor(
    private spot: SpotifyService,
    private queueService: QueueService,
    private location: Location,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
    fromEvent(this.input.nativeElement, "input")
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
        tap(q => (this.query = q)),
        filter(q => q.length > 0),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(q => this.queueService.omnisearch(q)),
        tap(x => console.log(x)),
        map((data: any) => data.tracks.items)
      )
      .subscribe(x => {
        console.log(x);
        this.tracks = x;
      });

    this.iconRegistry.addSvgIcon(
      "search",
      this.sanitizer.bypassSecurityTrustResourceUrl("assets/icons/search.svg")
    );
  }

  selectTrack(track: ITrack) {
    this.previewTrack = track;
  }

  addTrack() {
    this.spot.addTrack(this.previewTrack.id).subscribe(data => {
      console.log(data);
    });
    this.location.back();
  }

  close() {
    this.previewTrack = null;
  }
}
