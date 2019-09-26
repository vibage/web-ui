import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackInfoModalComponent } from './track-info-modal.component';

describe('TrackInfoModalComponent', () => {
  let component: TrackInfoModalComponent;
  let fixture: ComponentFixture<TrackInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
