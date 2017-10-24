import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCraneComponent } from './add-crane.component';

describe('AddCraneComponent', () => {
  let component: AddCraneComponent;
  let fixture: ComponentFixture<AddCraneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCraneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
