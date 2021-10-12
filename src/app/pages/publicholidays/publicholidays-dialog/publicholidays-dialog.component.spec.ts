import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicholidaysDialogComponent } from './publicholidays-dialog.component';

describe('PublicholidaysDialogComponent', () => {
  let component: PublicholidaysDialogComponent;
  let fixture: ComponentFixture<PublicholidaysDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicholidaysDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicholidaysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
