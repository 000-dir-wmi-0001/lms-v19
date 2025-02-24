import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-compiler',
  imports: [RouterModule],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.css'
})
export class CompilerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
