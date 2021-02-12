import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-class-type-select-list',
  templateUrl: './class-type-select-list.component.html',
  styleUrls: ['./class-type-select-list.component.scss']
})
export class ClassTypeSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'class_type_filter';
  public datastoreSelectList = 'class_type_select_list';
  public defaultSelection = {'default':true, 'list':{'Discussion': false}};
  public quickFilterName = 'classTypeQuickFilter';
  public selectionChange = 'com';
  private field = this.selectionChange;
  private headerName = 'Class Type';
  public columnState = {
    colId: this.field,
    sort: 'asc',
  };
  constructor(datastore: DatastoreService) {
    super(datastore);
    this.columnDefs = [
      {
        checkboxSelection: true,
        field: this.field,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerName: this.headerName,
        sortable: true,
        sortingOrder: ['asc', 'desc'],
      },
    ];
  }
  ngOnInit(): void {
  }
}
