import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import {Subscription} from "rxjs";
import {ProductService} from "../product.service";

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{
  @Input() productId!: number;
  errorMessage = '';
  // Product to display
  product!: Product;
  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  private subscription!: Subscription;
  private productService = inject(ProductService);
  ngOnChanges(changes: SimpleChanges): void {
    const currentId = changes['productId'].currentValue;
    this.subscription = this.productService.getProduct(currentId).subscribe(data => this.product = data)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  addToCart(product: Product) {
  }
}
