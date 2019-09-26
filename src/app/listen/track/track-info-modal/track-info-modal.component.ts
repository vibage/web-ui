import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { QueueService } from "src/app/services/queue.service";
import { ITrack, IUser } from "src/app/services";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-track-info-modal",
  templateUrl: "./track-info-modal.component.html",
  styleUrls: ["./track-info-modal.component.scss"]
})
export class TrackInfoModalComponent implements OnInit {
  track: ITrack;
  playable = false;
  removable = false;
  userName: string;

  constructor(
    private auth: AuthService,
    private queueService: QueueService,
    private dialogRef: MatDialogRef<TrackInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    console.log(data);
    this.track = data.track;
    this.playable = data.playable;
    this.removable = data.removable;

    this.auth.getUserData(this.track.addedBy).subscribe((user: IUser) => {
      this.userName = user.name;
    });
  }

  ngOnInit() {}

  remove() {
    this.queueService.removeTrack(this.track).subscribe(data => {
      console.log(data);
      this.dialogRef.close();
    });
  }

  play() {
    this.queueService.playTrack(this.track._id).subscribe(() => {
      console.log("Track Played");
      this.dialogRef.close();
    });
  }
}
