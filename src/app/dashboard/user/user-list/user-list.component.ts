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
          this.users = data.filter(user => user.isVerified === true);
          this.loginAccessUsers = data.filter(user => user.isVerified === false);
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


  deleteUser(userId: any): void {
    console.log(userId);
    this.userService.deleteUser(userId).subscribe({
      next: (user: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          customClass: {
            container: 'swal-wide'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'User Deleted Successfully',
        });
        this.closeModal()
        this.getUsers();
      },
      error: (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          customClass: {
            container: 'swal-wide'
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Failed to delete user',
        });
      },
    });

  }
  cancel(): void {
    this.modalRef.hide();
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
          text: err.error.message,
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });
      }
    });
  }



  rejectUser(userId: any) {

  }
}
