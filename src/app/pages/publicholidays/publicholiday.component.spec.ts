import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicholidayComponent } from './publicholiday.component';

describe('PublicholidayComponent', () => {
  let component: PublicholidayComponent;
  let fixture: ComponentFixture<PublicholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicholidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
