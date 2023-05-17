import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CartList, SingleProduct } from 'src/app/shared/models';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{
  product:SingleProduct;
  productId: number;
  loading: boolean = false;
  amount: number = 1;
  cartProducts: CartList[] = [];
  exist = null;
  faX = faXmark;

  constructor(private productService: ProductsService, private route: ActivatedRoute, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this.loading = true;
    this.productId = +this.route.snapshot.params['id'];
    this.productService.getAllProducts().subscribe({
      next: (res:any) => {
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            if (res[key].id == this.productId) {
              this.product = res[key];
              break;
            }
          }
        }
        this.loading = false;
        this.checkIfExist();
      },
      error: (e) => {
        alert(e);
        this.loading = false;
      }
    });
  }

  addAmount() {
    this.amount++;
  }

  reduceAmount() {
    this.amount--;
  }

  checkIfExist() {
    if(localStorage.getItem('cart')) {
      this.cartProducts = JSON.parse(localStorage.getItem('cart'));
      this.exist = this.cartProducts.find(item => item.product.id == this.product.id);
    } else {
      this.exist = null;
    }
  }

  removeFromCart() {
    this.cartProducts.splice(this.cartProducts.indexOf(this.exist), 1);
    this.notificationService.productsAmountInCart.next(this.cartProducts.length);
    this.updateLocalStorage();

    if (this.cartProducts.length == 0) {
      localStorage.clear();
    }
    this.checkIfExist();

    this.notificationService.showInfo('This item is removed from cart');
  }

  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartProducts));
  }

  addProductToCart() {
    if(localStorage.getItem('cart')) {
      this.checkIfExist()
    }

    if (this.exist) {
      this.notificationService.showError(this.product.title + ' has been already added in the cart');
    } else {
      this.product.addedToCart = true;
      this.cartProducts.push({product: this.product, quantity: this.amount});
      this.notificationService.productsAmountInCart.next(this.cartProducts.length);
      this.updateLocalStorage();
      this.checkIfExist();
      this.notificationService.showInfo(this.amount + ' of this item added to cart');
    }
  }
}
