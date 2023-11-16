import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, switchMap, tap} from "rxjs";
import {Product} from "./product";
import {ReviewService} from "../reviews/review.service";
import {Review} from "../reviews/review";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private httpClient = inject(HttpClient);
  private reviewService = inject(ReviewService);

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productsUrl).pipe(
      tap(data => console.log(data))
    )
  }

  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.productsUrl}/${id}`).pipe(
      tap(data => console.log(data)),
      switchMap(product => this.getProductWithReview(product)),
      tap(x => console.log(x)))
  }

  private getProductWithReview(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.httpClient.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
        map(reviews => ({...product, reviews} as Product))
      )
    } else return of(product)
  }
}
