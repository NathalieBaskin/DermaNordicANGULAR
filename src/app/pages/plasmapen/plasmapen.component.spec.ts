import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlasmapenComponent } from './plasmapen.component';

describe('PlasmapenComponent', () => {
  let component: PlasmapenComponent;
  let fixture: ComponentFixture<PlasmapenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlasmapenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlasmapenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
