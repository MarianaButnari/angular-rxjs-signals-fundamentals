import {Component, computed, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';

import {NgIf, NgFor, CurrencyPipe, AsyncPipe} from '@angular/common';
import { Product } from '../product';
import {catchError, EMPTY, Subscription, tap} from "rxjs";
import {ProductService} from "../product.service";
import {CartService} from "../../cart/cart.service";

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{
  // private subscription!: Subscription;
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  // @Input() productId!: number;
  // errorMessage = '';
  // Product to display
  // product!: Product;
  // readonly product$ = this.productService.product$.pipe(
  //   tap(data => console.log('COMPONENT', data)),
  //   catchError(err => {
  //     this.errorMessage = err;
  //     return EMPTY
  //   })
  // );
  product = this.productService.product;
  errorMessage = this.productService.productError;

  // Set the page title
  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = computed(() =>
      this.product()
        ? `Product Detail for: ${this.product()?.productName}`
        : 'Product Detail'
    // TODO TO AVOID TYPE NARROWING WITH OBJECTS WE CAN DO:
    // const productS = this.product();
    // productS ?`Product Detail for: ${productS.productName}` : 'Product Detail'
  )
  ngOnChanges(changes: SimpleChanges): void {
    // const currentId = changes['productId'].currentValue;
    // this.subscription = this.productService.getProduct(currentId).subscribe(data => this.product = data)
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
