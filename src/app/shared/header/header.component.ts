import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/cart/services/cart.service';
import { ModeService } from '../services/mode.service';
import { NotificationService } from '../services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit{
  constructor(private modeService: ModeService, private notificationService: NotificationService, private cartService: CartService, private modalService: NgbModal) {}

  isCollapsed = false;
  user = true;
  headerTitle = 'Online Market';
  cartTitle = 'Cart';
  productsAmount: number = null;
  ordersCount = null;
  notificationLoading = false;
  @ViewChild('howItWorks', {static: false}) guideModal; 

  changeMode(user: boolean) {
    this.user = user;
    this.headerTitle = user ? 'Online Market' : 'Admin Panel';
    this.cartTitle = this.user ? 'Cart' : 'Orders';
    localStorage.setItem('mode', JSON.stringify(this.user ? 'user' : 'admin'));
    this.modeService.setMode(JSON.parse(localStorage.getItem('mode')));
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.guideModal, { modalDialogClass: 'dark-modal', size: 'lg'});
  }

  ngOnInit(): void {
    this.getOrdersCount();

    this.notificationService.ordersAmount.subscribe({
      next: (res) => {
        this.getOrdersCount();
      },

      error: (e) => {
        this.notificationService.showError(e.message);
      }
    })

    if (localStorage.getItem('mode')) {
      this.headerTitle = JSON.parse(localStorage.getItem('mode'))  == 'admin' ? 'Admin Panel' : 'Online Market';
      this.cartTitle = JSON.parse(localStorage.getItem('mode'))  == 'admin' ? 'Orders' : 'Cart';
      this.user = JSON.parse(localStorage.getItem('mode'))  == 'admin' ? false : true;
    }

    if (JSON.parse(localStorage.getItem('cart')) && JSON.parse(localStorage.getItem('cart')).length != 0) {
      this.productsAmount = JSON.parse(localStorage.getItem('cart')).length;
    } else {
      this.productsAmount = null;
    }

    this.notificationService.productsAmountInCart.subscribe({
      next: (v) => {
        this.productsAmount = v;
      },
      error: (e) => {
        this.notificationService.showError("Can't show notifications");
      }
    })
  }

  changeColor() {
    let color = '#f1aeb5';
    this.user ? color='#f1aeb5' : color='white';

    return color;
  }

  getOrdersCount() {
    let sum = 0;
    this.notificationLoading = true;
    this.cartService.getAllCarts().subscribe({
      next: (res) => {
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            sum++;
          }
        }
        this.ordersCount = sum;
        this.notificationLoading = false;
      }
    })
  }

  openGuide(howItWorks) {
		this.modalService.open(howItWorks, { modalDialogClass: 'dark-modal', size: 'lg'});
	}
}
