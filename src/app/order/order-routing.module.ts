import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOrderComponent } from './edit-order/create-order.component';


const routes: Routes = [{
  path: '',
  component: CreateOrderComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
  static components = [CreateOrderComponent];
}
