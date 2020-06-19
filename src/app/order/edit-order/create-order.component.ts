import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '../../core/services/data.service';
import { ICustomer } from '../../shared/interfaces';
import { Router } from '@angular/router';
import { isNumberValidator } from '../../shared/validators/number-validator';
import { GrowlerMessageType, GrowlerService } from '../../core/growler/growler.service';

@Component({
  selector: 'cm-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  @ViewChild('search', { static: true }) private search: ElementRef;
  orderForm: FormGroup;
  ordersArr: FormArray;
  customers$: Observable<ICustomer[]>;
  errorMessage = '';
  showSuggestions = false;
  private componentDestroy$ = new Subject();

  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private router: Router,
              private growler: GrowlerService) {
  }

  ngOnInit() {
    this.orderForm = this.fb.group({
      customer: ['', [Validators.required]],
      customerId: ['', [Validators.required]],
      ordersArr: this.fb.array([
        this.createOrderFields()
      ]),

    });

    this.ordersArr = this.orderForm.get('ordersArr') as FormArray;

    this.customers$ = fromEvent(this.search.nativeElement, 'input')
      .pipe(
        takeUntil(this.componentDestroy$),
        debounceTime(500),
        switchMap((_) => {
          const query = this.search.nativeElement.value;
          this.orderForm.controls['customerId'].setValue(null);
          if (query.length) {
            return this.dataService.getCustomersByQuery(query)
              .pipe(
                tap((_res) => {
                  this.showSuggestions = _res.length > 0;
                })
              );
          } else {
            this.showSuggestions = false;
            return of([]);
          }
        })
      );
  }

  createOrderFields() {
    return this.fb.group({
      productName: ['', [Validators.required]],
      itemCost: ['', [isNumberValidator, Validators.required]]
    });
  }

  addOrderFields() {
    this.ordersArr.push(this.createOrderFields());
  }

  removeOrderFields() {
    this.ordersArr.removeAt(this.ordersArr.length - 1);
  }

  submit() {
    this.errorMessage = '';
    const formData = this.orderForm.getRawValue();
    const payload = formData.ordersArr.map((item) => ({ ...item, itemCost: +item.itemCost }));
    this.dataService.createOrder(formData.customerId, payload)
      .subscribe(
        (_) => {
          this.growler.growl('Order created successfully', GrowlerMessageType.Success);
          this.router.navigateByUrl('orders');
        },
        (_) => {
          this.errorMessage = 'Failed to create an order';
          this.growler.growl(this.errorMessage, GrowlerMessageType.Danger);
        });
  }

  cancel() {
    this.router.navigateByUrl('orders');
  }

  selectCustomer(customer: ICustomer) {
    this.showSuggestions = false;
    this.orderForm.patchValue({
      customer: `${customer.firstName} ${customer.lastName}`,
      customerId: customer.id
    });
  }

  ngOnDestroy() {
    this.componentDestroy$.next();
    this.componentDestroy$.unsubscribe();
  }
}
