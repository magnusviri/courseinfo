import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  gen_ed$ = this.http.get('http://localhost:3000/api/gen_ed');



  constructor(private http: HttpClient) {}

  name = 'Angular';

  categories = [
    {id: 1, name: 'Laravel'},
    {id: 2, name: 'Codeigniter'},
    {id: 3, name: 'React'},
    {id: 4, name: 'PHP'},
    {id: 5, name: 'Angular'},
    {id: 6, name: 'Vue'},
    {id: 7, name: 'JQuery', disabled: true},
    {id: 8, name: 'Javascript'},
  ];

  selected = [
    {id: 5, name: 'Angular'},
    {id: 6, name: 'Vue'}
  ];

  getSelectedValue(){
    console.log(this.selected);
  }

}
