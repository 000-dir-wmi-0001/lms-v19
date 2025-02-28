import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';

import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';


import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any
@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  activeTab = 'verified';
  selectedUser: any
  selectedStatus = 'all';
  isLoading = true;
  modalRef!: BsModalRef;
  userId: any;
  CurrentUser: any;
  users: any[] = [];        // Stores only verified users
  loginAccessUsers: any[] = [];
  userList = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Email' },
    { name: 'User Type' },
    { name: 'Action' },
  ];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data: any) => {  // Ensure 'data' is treated as an array
        this.isLoading = false;

        if (Array.isArray(data)) { // Check if data is actually an array

          this.users = data.filter(user => {
            const role = this.getRole(); // Get current user role

            return (role === 'ADMIN')
              ? user.type !== 'SUPERADMIN' && user.type !== 'ADMIN' && user.isVerified === true
              : (role === 'SUPERADMIN')
                ? true // If role is 'SUPERADMIN', fetch all users
                : user.isVerified === true; // For other roles, only show verified users
          });
          this.loginAccessUsers = data.filter(user => {
            const role = this.getRole(); // Get current user role

            return (role === 'ADMIN')
              ? user.type !== 'SUPERADMIN' && user.type !== 'ADMIN' && user.isVerified === false
              : (role === 'SUPERADMIN')
                ? true // If role is 'SUPERADMIN', fetch all users
                : user.isVerified === true; // For other roles, only show verified users
          });

        } else {
          console.error("Unexpected response format:", data);
        }
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      },
    });
  }


  openmodal(user: any) {
    this.selectedUser = user; // Assign user before opening modal
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')); // Open modal
    modal.show();
  }

  filterRecords() {
    if (this.selectedStatus == 'all') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.getUsers();
        },
        (error) => {
          console.log(error)
        }
      );
    } else if (this.selectedStatus == 'ADMIN') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.users = result.filter((record: any) => record.type == 'ADMIN');
        },
        (error) => {
          console.log(error)
        }
      );
    } else if (this.selectedStatus == 'INSTRUCTOR') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.users = result.filter((record: any) => record.type == 'INSTRUCTOR');
        },
        (error) => {
          console.log(error)
        }
      );
    } else if (this.selectedStatus == 'STUDENT') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.users = result.filter((record: any) => record.type == 'STUDENT');
        },
        (error) => {
          console.log(error)
        }
      );
    } else if (this.selectedStatus == 'SUPERADMIN') {
      this.userService.getUsers().subscribe(
        (result: any) => {
          this.users = result.filter((record: any) => record.type == 'SUPERADMIN');
        },
        (error) => {
          console.log(error)
        }
      );
    }
  }


  public getRole() {
    return this.storageService.getRole();
  }

  openModal(template: TemplateRef<any>, user: any) {
    this.selectedUser = user; // Store the user to use later
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


  // deleteUser(userId: any): void {
  //   console.log(userId);
  //   this.userService.deleteUser(userId).subscribe({
  //     next: (user: any) => {
  //       const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 4000,
  //         timerProgressBar: true,
  //         customClass: {
  //           container: 'swal-wide'
  //         },
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         },
  //       });
  //       Toast.fire({
  //         icon: 'success',
  //         title: 'User Deleted Successfully',
  //       });
  //       this.closeModal()
  //       this.getUsers();
  //     },
  //     error: (err) => {
  //       const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 4000,
  //         timerProgressBar: true,
  //         customClass: {
  //           container: 'swal-wide'
  //         },
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         },
  //       });
  //       Toast.fire({
  //         icon: 'error',
  //         title: 'Failed to delete user',
  //       });
  //     },
  //   });

  // }
  // cancel(): void {
  //   this.modalRef.hide();
  // }
  deleteUser(userId: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true, // Shows a cancel button
      confirmButtonColor: '#d33', // Color for confirm button
      cancelButtonColor: '#1b78fd', // Color for cancel button
      confirmButtonText: 'Yes, delete it!' // Text for confirm button
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: (user: any) => {
            Swal.fire(
              'Deleted!',
              'The user has been deleted.',
              'success'
            );
            this.closeModal();
            this.getUsers(); // Refresh the user list
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the user.',
              'error'
            );
          }
        });
      }
    });
  }

  showActionPopup(user: any) {
    Swal.fire({
      title: 'Do you Want to Approve?',
      text: `${user.firstName} ${user.lastName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        // Approve the user if Confirm button was clicked
        this.approveUser(user._id);
      } else {
        // Action canceled
        console.log('Action canceled');
      }
    });
  }

  approveUser(userId: string) {
    this.authService.approveUser(userId).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'User approved successfully!',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error approving user',
          text: err.error?.message || 'Something went wrong.',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });
      }
    });
  }



  // showActionPopup(user: any) {
  //   Swal.fire({
  //     title: 'Do you Want to Approve??',
  //     text: `${user.firstName} ${user.lastName}?`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Approve',
  //     cancelButtonText: 'Cancel',
  //     customClass: {
  //       confirmButton: 'swal2-confirm',  // Custom class for the Approve button
  //       cancelButton: 'swal2-cancel'     // Custom class for the Cancel button
  //     },
  //     // footer: `<button class="btn btn-danger" (click)="rejectUser(user)">Reject</button>`,
  //     preConfirm: (result) => {
  //       // This function is called when "Approve" is clicked
  //       if (result) {
  //         this.approveUser(user._id); // Approve the user
  //       } else {
  //         Swal.close(); // If Cancel is pressed, close the pop-up
  //       }
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.approveUser(user._id);
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // Cancel was clicked
  //       // console.log('Action canceled');
  //     }
  //   });
  // }

  // approveUser(userId: string) {
  //   this.authService.approveUser(userId).subscribe({
  //     next: (res: any) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'User approved successfully!',
  //         timer: 3000,
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //       });
  //     },
  //     error: (err: any) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error approving user',
  //         text: err.error?.message || 'Something went wrong.',
  //         timer: 3000,
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //       });
  //     }
  //   });
  // }


  // rejectUser(user: any) {
  //   console.log(`User ${user.firstName} rejected`);
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'User rejected',
  //     text: `${user.firstName} ${user.lastName} has been rejected.`,
  //   });
  // }


}
