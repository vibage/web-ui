import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostFindComponent } from './host-find.component';

describe('HostFindComponent', () => {
  let component: HostFindComponent;
  let fixture: ComponentFixture<HostFindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostFindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostFindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
