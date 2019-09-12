import { Component, OnInit, Input } from "@angular/core";
import { ITrack } from "../../services";
import { QueueService } from "../../services/queue.service";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"]
})
export class QueueComponent implements OnInit {
  @Input() host!: string;

  public tracks: ITrack[] = [];

  public tracks$: Observable<ITrack[]>;

  public isHost!: boolean;

  constructor(
    private queueService: QueueService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.queueService.setQueueId(params.id);
      }
    });
  }

  ngOnInit(): void {
    this.isHost = this.host === "true";
  }
}
