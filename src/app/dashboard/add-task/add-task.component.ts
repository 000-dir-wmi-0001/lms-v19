import { Component, OnInit } from '@angular/core';
import { Task } from '../task/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-task',
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router : Router,private authService: AuthService, private storageService: StorageService) { }

  isLoading: boolean = false;
  token!: string;

  ngOnInit(): void {
    
    this.isLoading = false;
    this.token = this.storageService.getToken() || ''; // ✅ Assign inside ngOnInit

  }

   //userId = this.storageService.getUserId();
  createTask(title: string){
    this.isLoading = true;
    this.taskService.addTasks('task/update',this.token,title).subscribe((task: Task|any) => {
      console.log(task);
      //this.router.navigate(['/task',task._id]);
      this.router.navigate(['dashboard/task']);
    });
  }

}
