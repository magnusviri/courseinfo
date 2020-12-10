import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { GridComponent } from './grid/grid.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'course', component: GridComponent,
    children: [
      {
        path: ':course_number',
        component: CourseDetailComponent,
      },
      {
        path: '',
        component: WelcomeComponent,
      },
    ],
  },
  { path: '**',  redirectTo: '/course'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  AdminComponent,
  CourseDetailComponent,
  GridComponent,
  WelcomeComponent,
]
