import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap
} from "rxjs";
import {Product, ResponseResult} from "./product";
import {ReviewService} from "../reviews/review.service";
import {Review} from "../reviews/review";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {HttpErrorService} from "../utilities/http-error.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private httpClient = inject(HttpClient);
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);
  // private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  // readonly productSelected$ = this.productSelectedSubject.asObservable();
  productSelectedSignal = signal<number| undefined>(undefined);


  productSelected(selectedProductId: number): void {
    // this.productSelectedSubject.next(selectedProductId);
    this.productSelectedSignal.set(selectedProductId);
  }
  // DECLARATIVE
  private readonly productsResult$ = this.httpClient.get<Product[]>(this.productsUrl).pipe(
    map(p =>(
      {data: p} as ResponseResult<Product[]>)),
    tap(data => console.log(JSON.stringify(data))),
    shareReplay(1),
    // catchError(err => {
    //     console.log(err);
    //     return of(err);
    //   }
    catchError(err => {
        return of({data: [], error: this.errorService.formatError(err)} as ResponseResult<Product[]>);
      }
    ))

  private productsResult = toSignal(this.productsResult$, {initialValue: ({data: []} as ResponseResult<Product[]>)});
  products = computed(() => this.productsResult().data)
  productsError = computed(() => this.productsResult().error)
  // computedSignal to handle errors
  // products = computed(() => {
  //   try {
  //     return toSignal(this.products$, {initialValue: [] as Product[]})();
  //   } catch (error) {
  //     return [] as Product[]
  //   }
  // });
  // PROCEDURAL
  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productsUrl).pipe(
      tap(data => console.log(data))
    )
  }
  // DECLARATIVE
  // readonly product$ = this.productSelected$.pipe(
  //   filter(Boolean),
  //   switchMap(id => {
  //     const productUrl = `${this.productsUrl}/${id}`
  //     return this.httpClient.get<Product>(productUrl).pipe(
  //       // tap(data => console.log(data)),
  //       switchMap(product => this.getProductWithReview(product)),
  //       tap(x => console.log(x)))
  //   })
  // )
  private productResult$ = toObservable(this.productSelectedSignal).pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = `${this.productsUrl}/${id}`
      return this.httpClient.get<Product>(productUrl).pipe(
        // tap(data => console.log(data)),
        switchMap(product => this.getProductWithReview(product)),
        tap(x => console.log(x)),
        catchError(err => {
            return of({data: undefined, error: this.errorService.formatError(err)} as ResponseResult<Product>);
          }
        ))
    }),
    map(p => (
      {data: p} as ResponseResult<Product>))
  )
  private productResult = toSignal(this.productResult$, {initialValue: ({data: undefined} as ResponseResult<Product>)})
  product = computed(() => this.productResult()?.data)
  productError = computed(() => this.productResult()?.error)
  // readonly product2$ = combineLatest([
  //   this.productSelected$,
  //   this.products$
  // ]).pipe(
  //   // tap(data => console.log(data)),
  //   map(([selectedProductID, products]) => {
  //    return  products.find((product: Product) => product.id === selectedProductID)
  //   }),
  //   //filter out null and undefined
  //   filter(Boolean),
  //   switchMap((product: Product) => this.getProductWithReview(product)),
  // )
  // PROCEDURAL
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
