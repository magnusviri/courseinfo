import { Component, OnInit } from '@angular/core';
import { TruncatePipe } from '../truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BackendService } from '../datastore.service';

@Component({
  selector: 'app-course-select-list',
  templateUrl: './course-select-list.component.html',
  styleUrls: ['./course-select-list.component.scss']
})
export class CourseSelectListComponent implements OnInit {
  public selectedOptions: string[] = [ ];
  constructor(public backend: BackendService) {}
  ngOnInit(): void {
  }
  onNgModelChange(event){
    console.log('on ng model change', event);
  }
}
