import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ITrack } from "src/app/services";
import { QueueService } from "src/app/services/queue.service";

@Component({
  selector: "app-track-preview-modal",
  templateUrl: "./track-preview-modal.component.html",
  styleUrls: ["./track-preview-modal.component.scss"]
})
export class TrackPreviewModalComponent {
  track!: ITrack;

  constructor(
    private dialogRef: MatDialogRef<TrackPreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: { track: ITrack },
    private queueService: QueueService
  ) {
    this.track = data.track;
  }

  addTrack() {
    this.queueService.addTrack(this.track._id).subscribe(data => {
      console.log(data);
      if (data.error) {
        alert(data.message);
      } else {
        this.dialogRef.close(true);
      }
    });
  }
}
