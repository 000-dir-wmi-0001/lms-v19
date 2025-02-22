import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faContactCard, faCircleUser, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  home = faHome;
  contact = faContactCard;
  profile = faCircleUser;
  add_category = faPlus;
  view_Category = faEye;
  selectedMenu: any = 'Home';

  constructor(private library: FaIconLibrary) {
    library.addIcons(faHome);
  }
  goTo(paramText: string) {
    this.selectedMenu = paramText
  }
}
