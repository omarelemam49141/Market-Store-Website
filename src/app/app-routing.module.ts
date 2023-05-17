import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart/cart.component';
import { PreviousOrdersComponent } from './cart/previous-orders/previous-orders.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';

const routes: Routes = [
  {path: '', component: AllProductsComponent},
  {path: 'carts', component: CartComponent},
  {path: 'productDetails/:id', component: ProductDetailsComponent},
  {path: 'previousOrders', component: PreviousOrdersComponent},
  {path: '**', redirectTo: "/", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
