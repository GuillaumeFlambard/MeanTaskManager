import {Component} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {Router} from '@angular/router';
import {User} from "../../../models/User";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [UsersService]
})

export class AppComponent {
  title = 'app works!';
  user: User;

  constructor(private usersService:UsersService, private router:Router) {
    console.log('Construct App components');
    this.user = new User;
    this.listenerUserService();
  }

  listenerUserService() {
    this.usersService.getUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  logoutAction (event) {
    event.preventDefault();
    this.usersService.logout().subscribe(response => {
      this.router.navigate(['login']);
    });
  }
}
