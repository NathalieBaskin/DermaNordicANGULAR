import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicfacialComponent } from './basicfacial.component';

describe('BasicfacialComponent', () => {
  let component: BasicfacialComponent;
  let fixture: ComponentFixture<BasicfacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicfacialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicfacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
