import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import {NgIf, NgFor, NgClass, AsyncPipe} from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";
import {catchError, EMPTY, Subscription, tap} from "rxjs";

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent implements OnInit, OnDestroy{
  private productService = inject(ProductService)
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';

  // Products
  // products: Product[] = [];

  // Selected product id to highlight the entry
  // selectedProductId: number = 0;
  readonly selectedProductId$ = this.productService.productSelected$
  // am avut nevoie de subscription cind foloseam modul procedural, in caz ca folosim declarativ nu avem nevoie de OnInit si OnDestroy
  // private subscription!: Subscription;
  readonly products$ = this.productService.products$.pipe(
    tap(data => console.log('COMPONENT', data)),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  );


  ngOnInit(): void {
    // this.subscription = this.productService.getProducts().subscribe(data => this.products = data);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  onSelected(productId: number): void {
    // this.selectedProductId = productId;
    this.productService.productSelected(productId);
  }

}
