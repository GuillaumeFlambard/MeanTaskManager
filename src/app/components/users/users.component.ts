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
        // Retrieve tasks from the API
        this.usersService.getAllTasks().subscribe(tasks => {
            this.users = users
        });
    }
}
