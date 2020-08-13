import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorenameComponent } from './storename.component';

describe('StorenameComponent', () => {
  let component: StorenameComponent;
  let fixture: ComponentFixture<StorenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
