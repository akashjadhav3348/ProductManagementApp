import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponentComponent } from './product-details-component.component';

describe('ProductDetailsComponentComponent', () => {
  let component: ProductDetailsComponentComponent;
  let fixture: ComponentFixture<ProductDetailsComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponentComponent]
    });
    fixture = TestBed.createComponent(ProductDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
