import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
isLoggedIn: any;
showHeaderFooter: any;

}
