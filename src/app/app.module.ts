import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { JsonApiModule } from 'angular2-jsonapi';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';
import { GridComponent } from './grid/grid.component';

import { AttrSelectListComponent } from './attr-select-list/attr-select-list.component';
import { CourseResultsComponent } from './course-results/course-results.component';
import { CourseDetailLinkComponent } from './course-detail-link/course-detail-link.component';
import { CourseSelectListComponent } from './course-select-list/course-select-list.component';
import { InstructorSelectListComponent } from './instructor-select-list/instructor-select-list.component';
import { SemesterSelectListComponent } from './semester-select-list/semester-select-list.component';
import { ComponentSelectListComponent } from './component-select-list/component-select-list.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,

    FooterComponent,
    HeaderComponent,
    AdminComponent,
    GridComponent,

    AttrSelectListComponent,
    CourseResultsComponent,
    CourseDetailLinkComponent,
    CourseSelectListComponent,
    InstructorSelectListComponent,
    SemesterSelectListComponent,
    ComponentSelectListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JsonApiModule,
    AgGridModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
