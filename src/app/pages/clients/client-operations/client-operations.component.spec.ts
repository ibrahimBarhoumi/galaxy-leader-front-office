import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOperationsComponent } from './client-operations.component';

describe('ClientOperationsComponent', () => {
  let component: ClientOperationsComponent;
  let fixture: ComponentFixture<ClientOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
