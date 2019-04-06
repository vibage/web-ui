import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify/spotify.service';
import { IHost } from '../spotify';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-find',
  templateUrl: './host-find.component.html',
  styleUrls: ['./host-find.component.scss']
})
export class HostFindComponent implements OnInit {
  public hosts: IHost[];

  constructor(
    private spot: SpotifyService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.spot.getHosts().subscribe((data: IHost[]) => {
      this.hosts = data;
    });
  }

  chooseHost(hostId: string) {
    this.spot.setHostId(hostId);
    this.router.navigate(['queuer']);
  }

}
