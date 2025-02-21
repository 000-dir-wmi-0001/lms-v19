import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Router, RouterLink } from '@angular/router';

import { StorageService } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import { CourseService } from '../../course.service';
import { CommonModule } from '@angular/common';

declare var Razorpay: any;
@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(10)),
    ]),
  ],
})
export class CartComponent implements OnInit {
  courses: any = [];
  token: any;
  userId: any;
  name: any;
  total = 0;
  paymentId: any;
  error: any;
  nocourseimage: any;
  payid!: string;
  orderid!: string;
  sign!: string;

  constructor(
    private courseService: CourseService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    this.getCourses();
  }

  public getCourses() {
    this.courseService.getCart(this.userId).subscribe({
      next: (data: any) => {
        this.courses = data.cart.courses;
        console.log("get courses afgter cart removal", this.courses);
        this.courses = this.courses.map((course: any) => {
          if (course.courseId.thumbnail) {
            this.courseService
              .getThumbnail(course.courseId._id, course.courseId.thumbnail)
              .subscribe({
                next: (data1) => {
                  course.url = data1;
                },
                error(err) {
                  console.log(err);
                },
              });
          }
          return course;
        });
        this.total = data.cart.subTotal;
      },
      error: (err) => { },
    });
  }

  removeItem(courseId: any) {
    this.courseService.removeItem(courseId, this.userId).subscribe({
      next: (data: any) => {
        this.courses = this.courses.filter(
          (course: any) => course['courseId'] != courseId
        );
        this.getCourses();
      },
      error: (err) => { },
    });
  }

  payNow() {
    const amount = this.total;
    this.courseService.getCart(this.userId).subscribe({
      next: (data: any) => {
        this.courses = data.cart.courses;
        console.log('courses', this.courses);
      },
    });

    this.courseService
      .createOrder(amount, this.courses, this.userId)
      .subscribe((order) => {
        const options = {
          key: environment.raz_key_id,
          amount: this.total * 100,
          name: 'Linkcode Technologies',
          description: 'Web Development',
          image: 'https://www.abhijitgatade.com/assets/img/favicon.png',
          order_id: order.orderId,
          handler: (response: any) => {
            var event = new CustomEvent('payment.success', {
              detail: response,
              bubbles: true,
              cancelable: true,
            });
            window.dispatchEvent(event);
            console.log(response, "response form handler")
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;

            this.courseService
              .verifyPayment(paymentId, orderId, signature)
              .subscribe({
                next: (res: any) => {
                  console.log(res, 'response of verify payment');
                  console.log(
                    paymentId,
                    orderId,
                    signature,
                    'payid, orderid, signature'
                  );
                  this.getCourses();
                },
                error: (err: any) => {
                  console.log(err, 'error of verify payment');
                },
              });
          },
          prefill: {
            name: 'Akanksha Dhage',
            email: 'aditi@gmail.com',
            contact: '1234567890',
          },
          theme: {
            color: '#3399cc',
          },
        };

        var rzp = new Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response: any) { });
      }),
      (error: any) => {
        console.log(error, 'last error col');
      };

  }
}
