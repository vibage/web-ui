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
    private queueService: QueueService,
    private auth: AuthService,
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
    fromEvent(this.input.nativeElement, "focus").subscribe(() => {
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
    this.queueService.addTrack(this.previewTrack.id).subscribe(data => {
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
