import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackPreviewModalComponent } from './track-preview-modal.component';

describe('TrackPreviewModalComponent', () => {
  let component: TrackPreviewModalComponent;
  let fixture: ComponentFixture<TrackPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackPreviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
