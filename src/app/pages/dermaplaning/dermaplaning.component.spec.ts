import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DermaplaningComponent } from './dermaplaning.component';

describe('DermaplaningComponent', () => {
  let component: DermaplaningComponent;
  let fixture: ComponentFixture<DermaplaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DermaplaningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DermaplaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
