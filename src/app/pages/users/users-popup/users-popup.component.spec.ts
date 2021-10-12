import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPopupComponent } from './users-popup.component';

describe('UsersPopupComponent', () => {
  let component: UsersPopupComponent;
  let fixture: ComponentFixture<UsersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
