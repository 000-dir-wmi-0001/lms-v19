import { Component } from '@angular/core';
import { CreateBatchComponent } from '../create-batch/create-batch.component';
import { ListBatchComponent } from '../list-batch/list-batch.component';

@Component({
  selector: 'app-batch',
  imports: [CreateBatchComponent, ListBatchComponent],
  templateUrl: './batch.component.html',
  styleUrl: './batch.component.css'
})
export class BatchComponent {

}
