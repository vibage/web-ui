import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
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
import { ITrack } from "../../services";
import { QueueService } from "../../services/queue.service";
import { AuthService } from "src/app/services/auth.service";
import { SpotifyService } from "src/app/services/spotify.service";
import { VibeService } from "src/app/services/vibe.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;

  public tracks!: ITrack[];
  public query = "";

  public previewTrack!: ITrack;

  public loading!: boolean;

  constructor(
    private queueService: QueueService,
    private spot: SpotifyService,
    private auth: AuthService,
    private vibeService: VibeService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
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
        tap(q => (this.query = q)),
        filter(q => q.length > 0),
        tap(() => {
          this.loading = true;
          this.tracks = [];
        }),
        debounceTime(300),
        // distinctUntilChanged(),
        switchMap(q => this.queueService.omnisearch(q))
      )
      .subscribe(tracks => {
        console.log({ tracks });
        this.tracks = tracks;
        this.loading = false;
      });
    fromEvent(this.input.nativeElement, "focus").subscribe(() => {
      this.vibeService.$vibe.subscribe(vibe => {
        if (!vibe.canUserAddTrack) {
          alert("Host has disabled adding songs");
          this.input.nativeElement.blur();
        }
      });
      if (!this.auth.isLoggedIn()) {
        alert("Please Login to add songs");
        this.input.nativeElement.blur();
      }
    });
  }

  selectTrack(track: ITrack) {
    this.previewTrack = track;
  }

  addTrack() {
    this.queueService.addTrack(this.previewTrack._id).subscribe(data => {
      if (data.error) {
        alert(data.message);
      }
      console.log(data);
    });
    this.previewTrack = null;
    this.input.nativeElement.value = "";
    this.query = "";
  }

  close() {
    this.previewTrack = null;
  }
}
