import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private http: HttpClient) {}
  private productsList = [];
  productsEvent = new Subject<any>();

  getProductsList() {
    this.productsEvent.next(this.productsList.slice());
    return this.productsList.slice();
  }

  getAllProducts() {
    return this.http.get('https://eccomerce-971b5-default-rtdb.firebaseio.com/products.json');
  }

  getAllCategories() {
    return this.http.get('https://eccomerce-971b5-default-rtdb.firebaseio.com/categories.json').pipe(map(res => {
      let categories = [];
      for (const key in res) {
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          categories.push(res[key].newCategory);
        }
      }

      return categories;
    }));
  }

  addCategory(category) {
    return this.http.post('https://eccomerce-971b5-default-rtdb.firebaseio.com/categories.json', category);
  }

  addProduct(product) {
    return this.http.post('https://eccomerce-971b5-default-rtdb.firebaseio.com/products.json', product);
  }

  updateProducts(updatedProducts) {
    return this.http.put('https://eccomerce-971b5-default-rtdb.firebaseio.com/products.json', updatedProducts);
  }

  delProduct(productKey) {
    return this.http.delete('https://eccomerce-971b5-default-rtdb.firebaseio.com/products/'+ productKey +'.json');
  }
}
