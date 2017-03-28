import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../../models/User';

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css']
})
export class UsersComponent implements OnInit {
    // instantiate tasks to an empty object
    users: User[];
    login: string;
    password: string;

    constructor(private usersService: UsersService) { }

    ngOnInit() {
        console.log('Init user');
    }

    loginAction (event) {
        event.preventDefault();
        var userLog = {
            login: this.login,
            password: this.password
        };

        this.usersService.login(userLog).subscribe(user => {
            // this.tasks.push(task);
            // this.title = "";
            console.log('Callback login');
        });
    }

}
