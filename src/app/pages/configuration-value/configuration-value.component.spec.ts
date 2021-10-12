import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationValueComponent } from './configuration-value.component';

describe('ConfigurationValueComponent', () => {
  let component: ConfigurationValueComponent;
  let fixture: ComponentFixture<ConfigurationValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
