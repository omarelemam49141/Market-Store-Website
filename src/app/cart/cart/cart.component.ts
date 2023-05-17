import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faTrash, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'; 
import { CartList, SingleProduct } from 'src/app/shared/models';
import { ModeService } from 'src/app/shared/services/mode.service';
import { CartService } from '../services/cart.service';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit{
  faDel = faTrash;
  faShow = faEye;
  faAccept = faCheck;
  faDecline = faClose;
  cartProducts: CartList[] = [];
  loading:boolean = false;
  emptyCart:boolean = false;
  totalCartAmount:number = 0;
  fixedAmount;
  mode = 'user';
  modeAtStart = null;
  carts:any = [];
  cartDetails:SingleProduct[] = [];
  orderLoading = false;
  cartsWithKey;
  cartModalReference: NgbModalRef;
  declineModalReference: NgbModalRef;
  removeCartLoading = false;
  declineOrderLoading = false;
  isMessageEmpty = false;
  declineMessage = "";
  messageRequired = false;

  constructor(private cartService: CartService, private modeService: ModeService, private modalService: NgbModal, private notificationService: NotificationService, config: NgbModalConfig) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  openCartDetails(content, cart) {
    this.cartDetails = cart;

    this.cartModalReference = this.modalService.open(content, { centered: true, size: 'lg' });
	}

  declineProcess(decline) {
    this.declineModalReference = this.modalService.open(decline, { centered: true, size: 'md' });
  }

  ngOnInit() {
    this.setModeAtStart();

    this.modeService.mode.subscribe(res => {
      this.mode = res;
      this.getCartInfo();
    });
    this.getCartInfo();
  }

  getCartInfo() {
    if (this.mode == "user") {
      this.getCartProducts();
    }

    if (this.mode == "admin") {
      this.getCarts();
    }
  }

  getCartProducts() {
    this.loading = true;
    this.checkProductsExisting();
    if (this.cartProducts.length == 0) {
      this.emptyCart = true;
    } else {
      this.emptyCart = false;
      this.calcCartAmount();
    }
    this.loading = false;
  }

  getCarts() {
    this.carts = [];
    this.loading = true;
    this.cartService.getAllCarts().subscribe({
      next: (res) => {
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            this.carts.push(res[key]);
          }
        }
        this.cartsWithKey = res;
        this.loading = false;
      },
      error: (e) => {
        alert(e);
        this.loading = false;
      }
    });
  }

  clearCart() {
    this.cartProducts = [];
    this.notificationService.productsAmountInCart.next(this.cartProducts.length);
    this.updatedLocalStorage();
    this.emptyCart = true;
  }

  deletProduct(product) {
    this.cartProducts.splice(this.cartProducts.indexOf(product), 1);
    this.notificationService.showInfo(product.product.title + ' is removed from the cart');
    this.notificationService.productsAmountInCart.next(this.cartProducts.length);
    this.updateCart();
    if (this.cartProducts.length == 0) {
      this.emptyCart = true;
    }
  }

  checkProductsExisting() {
    if (localStorage.getItem('cart')) {
      this.cartProducts = JSON.parse(localStorage.getItem('cart'));
    }
  }

  updatedLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  calcCartAmount() {
    this.totalCartAmount = 0;
    for(let product of this.cartProducts) {
      this.totalCartAmount += Number(+product.product.price * product.quantity);
      this.fixedAmount = this.totalCartAmount.toFixed(2);
    }
  }

  updateCart() {
    this.updatedLocalStorage();
    this.calcCartAmount();
  }

  makeOrder() {
    this.checkProductsExisting();
    this.loading = true;
    this.cartService.createOrder(this.cartProducts, "Omar Elemam").subscribe({
      next: (v) => {
        this.clearCart();
        this.notificationService.showSuccess('Your order has been sent');
        this.loading = false;
        this.notificationService.ordersAmount.next(true);
      },
      error: (e) => {
        alert(e);
        this.loading = false;
      }
    });
  }

  setModeAtStart() {
    this.modeAtStart = JSON.parse(localStorage.getItem('mode'));

    if (this.modeAtStart) {
      this.mode = this.modeAtStart;
    } else {
      this.mode = 'user';
    }
  }

  getCartPrice(cartProducts) {
    let price = 0,
    finalPrice;
    for (const cart of cartProducts) {
      price += (cart.product.price * cart.quantity);
    }

    finalPrice = price.toFixed(2);

    return finalPrice;
  }

  approveOrder(cart) {
    this.orderLoading = true;
    let keyOfCart = null;
    for (const key in this.cartsWithKey) {
      if (Object.prototype.hasOwnProperty.call(this.cartsWithKey, key)) {
        if (this.cartsWithKey[key].id == cart.id) {
          keyOfCart = key;
        }
      }
    }

    this.cartService.addOrder(cart).subscribe({
      next: (res) => {
        this.cartService.delCart(keyOfCart).subscribe({
          next: (v) => {
            this.notificationService.showSuccess('Order has been approved');
            this.cartModalReference.close();
            this.orderLoading = false;
            this.notificationService.ordersAmount.next(true);
            this.getCartInfo();
          },
          error: (e) => {
            this.notificationService.showError(e.message);
            this.orderLoading = false;
          }
        })
      },
      error: (e) => {
        this.notificationService.showError(e.message);
        this.orderLoading = false;
      }
    })
  }

  checkValidity() {
    if (this.declineMessage.replace(/\s/g, "") == '') {
      this.messageRequired = true;
    } else {
      this.messageRequired = false;
    }
  }

  declineOrder(cart) {
    this.checkValidity();
    if (this.messageRequired) {
      return;
    }

    this.declineOrderLoading = true;
    let keyOfCart = null;
    for (const key in this.cartsWithKey) {
      if (Object.prototype.hasOwnProperty.call(this.cartsWithKey, key)) {
        if (this.cartsWithKey[key].id == cart.id) {
          keyOfCart = key;
        }
      }
    }

    cart.message = this.declineMessage;

    this.cartService.addRefusedOrder(cart).subscribe({
      next: (res) => {
        this.declineOrderLoading = false;
        this.notificationService.showSuccess('Decline message sent to ' + cart.client);
        this.declineModalReference.close();
        this.declineMessage = '';
        this.removeCartLoading = true;
        this.cartService.delCart(keyOfCart).subscribe({
          next: (v) => {
            this.notificationService.showSuccess('Order has been refused');
            this.cartModalReference.close();
            this.removeCartLoading = false;
            this.notificationService.ordersAmount.next(true);
            this.getCartInfo();
          },
          error: (e) => {
            this.notificationService.showError(e.message);
            this.removeCartLoading = false;
          }
        })
      },
      error: (e) => {
        this.notificationService.showError(e.message);
        this.declineOrderLoading = false;
      }
    })
  }
}
