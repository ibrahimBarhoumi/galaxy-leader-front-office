import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationValuePopupComponent } from './configuration-value-popup.component';

describe('ConfigurationValuePopupComponent', () => {
  let component: ConfigurationValuePopupComponent;
  let fixture: ComponentFixture<ConfigurationValuePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationValuePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationValuePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
