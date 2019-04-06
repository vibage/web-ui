import { Component, OnInit } from '@angular/core';
import { QueuerService } from './queuer.service';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {

  constructor(
    private queuerService: QueuerService,
  ) { }

  ngOnInit() {
    const token = this.queuerService.getUserToken();
  }

}
