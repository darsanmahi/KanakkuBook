import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaystoreComponent } from './displaystore.component';

describe('DisplaystoreComponent', () => {
  let component: DisplaystoreComponent;
  let fixture: ComponentFixture<DisplaystoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaystoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaystoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
