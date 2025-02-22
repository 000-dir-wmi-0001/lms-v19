import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Task } from './task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [CommonModule , ReactiveFormsModule , FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  tasks: any;
  filteredTasks: any;
  displayedTasks: any[] = [];
  userId: string | undefined;
  selectedTaskId: string | any;
  token: string | null = null;
  @ViewChild('searchBox') searchInput!: ElementRef<HTMLInputElement>;

    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalItems: number = 0;
    totalPages: number = 0;
  id: any;
  isLoading: boolean = true;
  searchQuery: string = '';
  shouldFilter: boolean = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.selectedTaskId = params['_id'];
    });

    const token = this.storageService.getToken();
    this.taskService.getTasks('task', token).subscribe({
      next: (tasks: any) => {
        this.isLoading = false;
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.totalItems = tasks.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateDisplayedTasks();
      },
      error: (err) => {
        console.log('error');
      },
    });
  }

    // Pagination methods
    updateDisplayedTasks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage; // Now uses 5 instead of 10
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedTasks = this.filteredTasks.slice(startIndex, endIndex);
    }
    onPageChange(page: number) {
      this.currentPage = page;
      this.updateDisplayedTasks();
    }
  
    getPages(): (number | '...')[] {  // More specific return type
      const totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
      const currentPage = this.currentPage;
      
      let pages: (number | '...')[] = [];
      
      if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        pages.push(1);
        
        if (currentPage > 3) {
          pages.push('...');
        }
        
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
          pages.push(i);
        }
        
        if (currentPage < totalPages - 2) {
          pages.push('...');
        }
        
        pages.push(totalPages);
      }
      
      return pages;
    }
    
    // Add this helper method
    isNumber(value: number | '...'): value is number {
      return typeof value === 'number';
    }
 // Existing methods with pagination updates
 onDeleteTaskClick(id: string) {
  this.taskService.deleteList(id).subscribe((res: any) => {
    this.tasks = this.tasks.filter((task: { _id: string }) => task._id !== id);
    this.filteredTasks = this.tasks;
    this.totalItems = this.filteredTasks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedTasks();
    this.router.navigate(['dashboard/task']);
    console.log(res);
  });
}

add(title: string) {
  console.log('Input value from popup:', title);
  this.taskService.addTasks('task/update', this.token, title).subscribe((task: Task | any) => {
    console.log(task);
    this.tasks.push(task);
    this.filteredTasks = this.tasks;
    this.totalItems = this.filteredTasks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedTasks();
  });
}

  async popup(id: string) {
    try {
      this.taskService.getTask('task/gettask', this.token, id).subscribe({
        next: (response: any) => {
          if (response && response.task) {
            const taskDetails = response.task;
            Swal.fire({
              input: 'text',
              inputLabel: 'Edit Work Report',
              inputValue: taskDetails.title || '',
              inputPlaceholder: 'Enter your Work here...',
              inputAttributes: {
                'aria-label': 'Type your Work here'
              },
              showCancelButton: true,
              confirmButtonText: 'Update',
              allowOutsideClick: false,
              allowEscapeKey: false,
              preConfirm: (input) => {
                if (!input) {
                  Swal.showValidationMessage('Please enter a value');
                  return false;
                }
                return input;
              }
            }).then(({ value: text, isConfirmed }) => {
              if (isConfirmed) {
                this.anotherMethod(text, id);
              }
            });

          } else {
            Swal.fire('Error', 'Task not found', 'error');
          }
        },
        error: (err) => {
          console.error('Error fetching task:', err);
          Swal.fire('Error', 'Failed to fetch task details', 'error');
        }
      });
    } catch (error) {
      console.error('Error in popup function:', error);
      Swal.fire('Error', 'An unexpected error occurred', 'error');
    }
  }

  anotherMethod(newTitle: string, id: string) {
    console.log('Input value from popup:', newTitle, id);
    this.taskService.updateTasks(id, newTitle).subscribe((updatedTask: Task | any) => {
      const taskIndex = this.tasks.findIndex((task: { _id: string; }) => task._id === id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].title = newTitle;
        this.filteredTasks = this.tasks; // Update filteredTasks after update
      }
    });
  }

  async addWork() {
    const { value: text, isConfirmed } = await Swal.fire({
      input: 'text',
      inputLabel: 'Add Work Report',
      inputPlaceholder: 'Enter your Work here...',
      inputAttributes: {
        'aria-label': 'Type your Work here'
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: (input) => {
        if (!input) {
          Swal.showValidationMessage('Please enter a value');
          return false;
        }
        return input;
      }
    });

    if (isConfirmed) {
      this.add(text);
    }
  }

  

  onSearch() {
    if (this.searchQuery) {
      this.shouldFilter = true;
      this.filteredTasks = this.tasks.filter((task: any) =>
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.shouldFilter = false;
      this.filteredTasks = this.tasks;
    }
    this.currentPage = 1;
    this.totalItems = this.filteredTasks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedTasks();
  }

  resetFilter() {
    this.searchQuery = '';
    this.shouldFilter = false;
    this.filteredTasks = this.tasks;
    this.currentPage = 1;
    this.totalItems = this.filteredTasks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateDisplayedTasks();
  }
}

