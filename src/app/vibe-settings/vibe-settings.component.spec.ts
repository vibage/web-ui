import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VibeSettingsComponent } from './vibe-settings.component';

describe('VibeSettingsComponent', () => {
  let component: VibeSettingsComponent;
  let fixture: ComponentFixture<VibeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VibeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VibeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
