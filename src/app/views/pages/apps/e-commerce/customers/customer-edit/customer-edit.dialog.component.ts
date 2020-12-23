// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../../core/_base/crud';
// Services and Models
import { CustomerModel,
	CustomerUpdated,
	CustomerOnServerCreated,
	selectLastCreatedCustomerId,
	selectCustomersActionLoading,
	CustomersService
} from '../../../../../../core/e-commerce';
import { FactureModel } from 'src/app/core/e-commerce/_models/facture.model';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-customers-edit-dialog',
	templateUrl: './customer-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class CustomerEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	customer: any;
	facture: FactureModel;
	customerForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<CustomerEditDialogComponent>
	 * @param data: any
	 * @param fb: FormBuilder
	 * @param store: Store<AppState>
	 * @param typesUtilsService: TypesUtilsService
	 */
	constructor(public dialogRef: MatDialogRef<CustomerEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private customersService:CustomersService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.store.pipe(select(selectCustomersActionLoading)).subscribe(res => this.viewLoading = res);
		this.customer = this.data.customer;
		this.createForm();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.customerForm = this.fb.group({
			
	       nom: [this.customer.idUser.nom, Validators.required],
			prenom: [this.customer.idUser.prenom, Validators.required],
			email: [this.customer.idUser.email, Validators.compose([Validators.required, Validators.email])],
			dob: [this.customer.date, Validators.compose([Validators.nullValidator])],
			userName: [this.customer.description, Validators.compose([Validators.required])],
			gender: [this.customer.gender, Validators.compose([Validators.required])],
			ipAddress: [this.customer.prix, Validators.compose([Validators.required])],
			status:[this.customer.status,Validators.compose([Validators.required])]
		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.customer.id > 0) {
			return `détails facture de Monsieur '${this.customer.idUser.nom} ${
				this.customer.idUser.prenom
				}'`;
		}

		return 'New bill';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.customerForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared customer
	 */_customer :any;
	prepareCustomer() {
		const controls = this.customerForm.controls;
		 
		this._customer.id = this.customer.id;
		const _date = controls.dob.value;
		if (_date) {
			this._customer.dateOfBbirth = this.typesUtilsService.dateFormat(_date);
		} else {
			this._customer.dateOfBbirth = '';
		}
		this._customer.idUser.nom= controls.nom.value;
		this._customer.idUser.prenom = controls.prenom.value;
		this._customer.idUser.prenom.email = controls.email.value;
	/*	_customer.userName = controls.userName.value;
		_customer.gender = controls.gender.value;
		_customer.ipAddress = controls.ipAddress.value;
		_customer.type = +controls.type.value;
		_customer.status = this.customer.status;*/
		return this._customer;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
	/*	this.hasFormErrors = false;
		const controls = this.customerForm.controls;
		/** check form */
		/*if (this.customerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}*/

		const editedCustomer = this.prepareCustomer();
		console.log(editedCustomer);
		
		if (editedCustomer.id > 0) {
			this.updateCustomer(editedCustomer);
		} else {
			this.createCustomer(editedCustomer);
		}
	}

	/**
	 * Update customer
	 *
	 * @param _customer: any
	 */
	updateCustomer(_customer: any) {
		const updateCustomer: Update<any> = {
			id: _customer.id,
			changes: _customer
		};
		this.store.dispatch(new CustomerUpdated({
			partialCustomer: updateCustomer,
			customer: _customer
		}));
		this.customersService.updateCustomer(_customer).subscribe();

		// Remove this line
		//of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _customer, isEdit: true }));
		// Uncomment this line
		this.dialogRef.close({ _customer, isEdit: true })
	}

	/**
	 * Create customer
	 *
	 * @param _customer: CustomerModel
	 */
	createCustomer(_customer: any) {
		this.store.dispatch(new CustomerOnServerCreated({ customer: _customer }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedCustomerId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _customer, isEdit: false });
		});
	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
