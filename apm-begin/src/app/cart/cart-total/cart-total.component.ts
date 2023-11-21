import {Component, inject} from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import {CartService} from "../cart.service";

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe]
})
export class CartTotalComponent {
  private cartService = inject(CartService);
  // Just enough here for the template to compile
  cartItems= this.cartService.cartItems;

  subTotal = this.cartService.subTotal;
  deliveryFee = this.cartService.deliveryFee;
  tax = this.cartService.tax;
  totalPrice = this.subTotal() + this.deliveryFee() + this.tax();

}
