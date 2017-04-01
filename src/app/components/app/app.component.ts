import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private router:Router) { }

  logout (event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }
}
