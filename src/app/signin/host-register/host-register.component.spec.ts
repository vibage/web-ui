import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRegisterComponent } from './host-register.component';

describe('HostRegisterComponent', () => {
  let component: HostRegisterComponent;
  let fixture: ComponentFixture<HostRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
