import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {

  contact = 919604430489;
  isLoggedIn = false;
  isNavExpanded: boolean = false;

  toggleNavigation() {
    this.isNavExpanded = !this.isNavExpanded;
  }

  constructor(private storageService: StorageService) {}

   

  ngOnInit(): void {
  }

  public getRole() {
    return this.storageService.getRole();
  }

}
