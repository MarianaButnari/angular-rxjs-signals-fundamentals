import {Component, inject, OnDestroy, OnInit} from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import {ProductService} from "../product.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy{
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;
  private subscription!: Subscription;
  private productService = inject(ProductService)

  ngOnInit(): void {
    this.subscription = this.productService.getProducts().subscribe(data => this.products = data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }

}
