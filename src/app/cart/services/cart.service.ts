import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CartList } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  createOrder(cartProducts: CartList[], clientName) {
    return this.http.post('https://eccomerce-971b5-default-rtdb.firebaseio.com/carts.json', {
      client: clientName,
      date: new Date(),
      cartProducts: cartProducts,
      status: 'pending',
      orderRate: 0,
      id: "Omar Elemam" + new Date().getTime()
    });
  }

  getAllCarts() {
    return this.http.get('https://eccomerce-971b5-default-rtdb.firebaseio.com/carts.json');
  }

  delCart(cartKey) {
    return this.http.delete('https://eccomerce-971b5-default-rtdb.firebaseio.com/carts/'+ cartKey +'.json')
  }

  addOrder(order) {
    order.approvedDate = new Date();
    return this.http.post('https://eccomerce-971b5-default-rtdb.firebaseio.com/orders.json', order);
  }

  addRefusedOrder(order) {
    order.refusedDate = new Date();
    return this.http.post('https://eccomerce-971b5-default-rtdb.firebaseio.com/refusedOrders.json', order);
  }

  getRefusedOrders() {
    return this.http.get('https://eccomerce-971b5-default-rtdb.firebaseio.com/refusedOrders.json');
  }

  getAllOrders() {
    return this.http.get('https://eccomerce-971b5-default-rtdb.firebaseio.com/orders.json')
  }
}
