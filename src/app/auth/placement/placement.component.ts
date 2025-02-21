import { Component, OnInit } from '@angular/core';
import { PlacementsService } from '../../services/placements.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-placement',
  imports: [CommonModule],
  templateUrl: './placement.component.html',
  styleUrl: './placement.component.css'
})
export class PlacementComponent implements OnInit {

  contact = 919604430489;
  isLoggedIn = false;
  isNavExpanded: boolean = false;

  toggleNavigation() {
    this.isNavExpanded = !this.isNavExpanded;
  }

  constructor(private storageService: StorageService, private placementService: PlacementsService) { }
  allRec : any = [];
  chunkedData: any[] = [];
  async ngOnInit() {
      await this.placementService.getPlace().subscribe(
        (res) => {
            this.allRec = res;
            console.log(res);
            this.allRec = this.allRec.sort((a:any,b:any) => b.Package - a.Package);
            this.chunkedData = this.chunkArray(this.allRec, 8);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  chunkArray(arr: any[], chunkSize: number): any[][] {
    let result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }
  public getRole() {
    return this.storageService.getRole();
  }
}
