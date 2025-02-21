import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  imports: [CommonModule, FooterComponent, HeaderComponent, RouterOutlet],
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoggedIn !: boolean;
  showHeaderFooter = true;

  constructor(private readonly storageService: StorageService, private readonly router: Router) {
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      if (currentRoute === '/login' || currentRoute === '/register') {
        this.showHeaderFooter = false;
      } else {
        this.showHeaderFooter = true;
      }
    });
  }
  ngOnInit(): void {

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

  }

}
