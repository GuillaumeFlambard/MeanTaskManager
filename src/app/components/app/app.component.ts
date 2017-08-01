import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { UsersService } from '../../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor(private usersService: UsersService, private router:Router) { }

  logoutAction (event) {
    event.preventDefault();
    this.usersService.logout().subscribe(response => {
      this.router.navigate(['login']);
    });
  }
}
