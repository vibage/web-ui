import { Component, Output, EventEmitter } from "@angular/core";
import { ApiService, IDevice } from "src/app/services/api.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-device-picker",
  templateUrl: "./device-picker.component.html",
  styleUrls: ["./device-picker.component.scss"]
})
export class DevicePickerComponent {
  @Output() selectedDeviceChange = new EventEmitter<IDevice>();
  private devices$ = new BehaviorSubject<IDevice[]>([]);

  constructor(
    private api: ApiService,
  ) {
    this.api.getDevices().subscribe(devices => {
      console.log(devices);
      return this.devices$.next(devices);
    });
  }

  start(device: IDevice) {
    this.selectedDeviceChange.emit(device);
  }
}
