import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../datastore.service';

@Component({
  selector: 'app-instructor-select-list',
  templateUrl: './instructor-select-list.component.html',
  styleUrls: ['./instructor-select-list.component.scss']
})
export class InstructorSelectListComponent implements OnInit {
  public selectedOptions: string[] = [];
  constructor(public backend: BackendService) {}
  ngOnInit(): void {
    console.log("ngOnInit");
  }
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
}
