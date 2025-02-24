import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterContainerComponent } from "./toaster/toaster-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lms-linkcode';
}
