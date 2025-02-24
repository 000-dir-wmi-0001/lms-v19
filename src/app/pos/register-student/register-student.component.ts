import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-student',
  imports: [],
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css'
})
export class RegisterStudentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  username: string = localStorage.getItem('role')!;
}