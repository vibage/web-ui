import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { switchMap, filter, debounceTime, map, tap } from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";
import { MatIconRegistry, MatDialog } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { ITrack } from "../../services";
import { QueueService } from "../../services/queue.service";
import { AuthService } from "src/app/services/auth.service";
import { VibeService } from "src/app/services/vibe.service";
import { TrackPreviewModalComponent } from "./track-preview-modal/track-preview-modal.component";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild("searchInput") input: ElementRef;

  public tracks$!: Observable<ITrack[]>;
  public query = "";

  public previewTrack!: ITrack;

  public loading!: boolean;

  constructor(
    private queueService: QueueService,
    private auth: AuthService,
    private vibeService: VibeService,
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "search",
      sanitizer.bypassSecurityTrustResourceUrl("assets/icons/search.svg")
    );
  }

  ngAfterViewInit(): void {
    this.tracks$ = fromEvent(this.input.nativeElement, "input").pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      tap(q => (this.query = q)),
      filter(q => q.length > 0),
      tap(() => (this.loading = true)),
      debounceTime(300),
      switchMap(q => this.queueService.omnisearch(q)),
      tap(tracks => console.log({ tracks })),
      tap(() => (this.loading = false))
    );

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
    this.dialog
      .open(TrackPreviewModalComponent, {
        data: { track }
      })
      .afterClosed()
      .subscribe(didAddSong => {
        if (didAddSong) {
          this.previewTrack = null;
          this.input.nativeElement.value = "";
          this.query = "";
        }
      });
  }
}
