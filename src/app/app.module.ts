import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AgGridModule } from 'ag-grid-angular';

import { AttrSelectListComponent } from './attr-select-list/attr-select-list.component';
import { CourseSelectListComponent } from './course-select-list/course-select-list.component';
import { InstructorSelectListComponent } from './instructor-select-list/instructor-select-list.component';
import { SemesterSelectListComponent } from './semester-select-list/semester-select-list.component';

import { ResultsTableComponent } from './results-table/results-table.component';

import { TemplateRendererComponent } from './template-renderer/template-renderer.component';
import { CellRouterLinkComponent } from './cell-router-link/cell-router-link.component';

import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// import { CommonModule } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { TruncatePipe } from './truncate.pipe';
// import { SelectAllCheckboxComponent } from './select-all-checkbox/select-all-checkbox.component';

@NgModule({
  declarations: [
    AppComponent,

    AttrSelectListComponent,
    CourseSelectListComponent,
    InstructorSelectListComponent,
    SemesterSelectListComponent,

    ResultsTableComponent,
    TemplateRendererComponent,
    CellRouterLinkComponent,

    // SelectAllCheckboxComponent,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule.withComponents([
      TemplateRendererComponent,
      CellRouterLinkComponent
    ]),
    // CommonModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,

    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
