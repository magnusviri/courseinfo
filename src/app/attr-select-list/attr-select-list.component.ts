import { Component, OnInit } from '@angular/core';
import { DatastoreService } from '../datastore.service';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-attr-select-list',
  templateUrl: './attr-select-list.component.html',
  styleUrls: ['./attr-select-list.component.scss']
})
export class AttrSelectListComponent extends SelectListComponent implements OnInit {
  // Overrides
  public datastoreFilter = 'attr_filter';
  public datastoreSelectList = 'attr_select_list';
  public quickFilterName = 'attrQuickFilter';
  public selectionChange = 'attr';
  private field = this.selectionChange;
  private headerName = 'Course Attribute';
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
        tooltipField: this.field,
        // valueFormatter: function(params) {
        //   console.log(params);
        //   return params.value+' '+params.data.season;
        // },
      },
  //     { field: 'desc', sortable: true },
  //     { field: 'courses', sortable: true },
  //     { field: 'id' },
    ];
  }
  ngOnInit(): void {
  }
}
