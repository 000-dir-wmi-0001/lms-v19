import { Component, OnInit } from '@angular/core';
import { Task } from '../task/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-task',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css'
})
export class UpdateTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router : Router,private authService: AuthService, private storageService: StorageService) { }
  taskId: string|any;
  token: string | null = null;

  ngOnInit(): void {
   
      /*(params: Params) => {
        //this.taskId = params['id'];
        const taskId = params['_id'];
        console.log("23"+taskId);
      }*/
        this.token = this.storageService.getToken();

    this.route.params.subscribe((params: Params) => {
      this.taskId = params['id'];
      console.log(this.taskId);
    });
  }
  

  

  //userId = this.storageService.getUserId();
   //_id = this.storageService.getId() ?? '';
  
  /*updateTask(id: string,title: string) {
    this.taskService.updateTasks(`task/${id}`,this.userId,this.token,title).subscribe(() => {
      this.router.navigate(['/task',id]);
    })
  }*/
  
  updateTask( newTitle: string) {
    console.log("update task component"+this.taskId);
    this.taskService.updateTasks( this.taskId, newTitle)
      .subscribe((updatedTask: Task | any) => {
        console.log(updatedTask);
       // this.router.navigate(['/task']);
       this.router.navigate(['dashboard/task']);
      });
  }


}