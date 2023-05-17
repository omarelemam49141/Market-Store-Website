import { Component, Input, OnInit } from '@angular/core';
import { faCartShopping, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CartList, SingleProduct } from 'src/app/shared/models'; 
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  constructor(private notificationService: NotificationService) {}

  faCart = faCartShopping;
  faX = faXmark;
  @Input() product:SingleProduct;
  @Input() productIndex;
  cartProducts: CartList[] = [];
  amountToggle:Boolean = false;
  amount: number = 1;
  exist = null;

  ngOnInit() {
    if(localStorage.getItem('cart')) {
      this.checkIfExist();
      if (this.exist) {
        this.product.addedToCart = true;
        console.log('added');
      }
    }
  }

  addProductToCart() {
    if(localStorage.getItem('cart')) {
      this.checkIfExist()
    }

    if (this.exist) {
      this.notificationService.showError(this.product.title + ' has been already added to the cart');
    } else {
      this.product.addedToCart = true;
      this.cartProducts.push({product: this.product, quantity: this.amount});
      this.notificationService.productsAmountInCart.next(this.cartProducts.length);
      this.updateLocalStorage();
      this.notificationService.showInfo(this.amount + ' of ' + this.product.title + ' is added to the cart');
    }

    this.amountToggle = false;
  }

  removeFromCart() {
    this.cartProducts = JSON.parse(localStorage.getItem('cart'));
    let theItemToRemove = this.cartProducts.find(item => item.product.id == this.product.id);
    this.cartProducts.splice(this.cartProducts.indexOf(theItemToRemove), 1);
    this.notificationService.productsAmountInCart.next(this.cartProducts.length);
    //';;;;;;;;;;;;;;;;;;;;;;;;;;;//
    this.product.addedToCart = false;
    ////////////////////////////////////
    this.updateLocalStorage();
    this.notificationService.showInfo(this.product.title + ' is removed from the cart');
    this.amountToggle = false;
    if(this.cartProducts.length == 0) {
      localStorage.clear();
    }
  }

  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  checkIfExist() {
    this.cartProducts = JSON.parse(localStorage.getItem('cart'));
    this.exist = this.cartProducts.find(item => item.product.id == this.product.id);
  }
}
