import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../common/models/User';
import { MatExpansionModule } from '@angular/material/expansion';
import { Customer } from '../common/models/Customer';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeModal') closeModalWindow: ElementRef | any;

  isCustomerView: Boolean = false;
  currentUser: User = new User();
  customerList: Customer[] = [];
  dataReceived: any;
  email: any;
  errorMessage: any;
  noCustomer: any;
  custToBeUpdated: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('user');
    this.getUser();
  }

  getUser() {
    this.http
      .get<User>('http://localhost:8080/user/get/' + this.email)
      .subscribe((result) => {
        this.currentUser = result;
      });
  }

  openCustomerView() {
    this.isCustomerView = true;
  }

  openHome() {
    this.isCustomerView = false;
  }

  showInput() {
    this.errorMessage = '';
    var inpFields = document.getElementById('customer-inp-fields');
    if (inpFields?.hidden == false) {
      inpFields.hidden = true;
    } else if (inpFields?.hidden == true) {
      inpFields.hidden = false;
    }
  }

  addCustomer(custName: any, city: any) {
    this.errorMessage = '';
    this.noCustomer = '';
    var inpFields = document.getElementById('customer-inp-fields');
    var cust = new Customer();
    cust.customerName = custName;
    cust.city = city;
    if (custName !== '' && city !== '') {
      this.http
        .post('http://localhost:8080/user/customer/add/' + this.email, cust)
        .subscribe((result) => {
          if (result == true) {
            this.getUser();
          }
        });
      if (inpFields?.hidden == false) {
        inpFields.hidden = true;
      }
    } else {
      this.errorMessage = 'Please provide input for both the fields';
    }
  }

  removeCustomer(cust: Customer) {
    this.http
      .post('http://localhost:8080/user/customer/remove/' + this.email, cust)
      .subscribe((result) => {
        if (result == true) {
          this.getUser();
        }
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  updateCustomer(custName: any, city: any) {
    if (custName !== '' && city !== '') {
      var customer = { customerName: custName, city: city };
      this.customerList = this.currentUser.customers;
      this.customerList.push(customer);
      var index = this.customerList.indexOf(this.custToBeUpdated);
      if (index > -1) {
        this.customerList.splice(index, 1);
      }

      this.http
        .put(
          'http://localhost:8080/user/customer/update/' + this.email,
          this.customerList
        )
        .subscribe((result) => {
          if (result == true) {
            this.getUser();
          }
        });
    }
    this.closeModalWindow.nativeElement.click();
  }

  storeOldValue(cust: any) {
    this.custToBeUpdated = cust;
  }
}
