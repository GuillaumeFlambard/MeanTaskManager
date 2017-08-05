import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../../models/User';
import {Router} from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css']
})

export class UsersComponent implements OnInit {

    users: User[];
    login: string;
    password: string;
    wrongMessage: string;
    loginRegistration: string;
    passwordRegistration: string;
    wrongMessageRegistration: string;

    constructor(private usersService: UsersService, private router:Router) { }

    ngOnInit() {
        console.log('Init user');
        this.usersService.isAuthenticate().subscribe(user => {
            if (Object.keys(user).length != 0)
            {
                console.log('user', user);
                this.router.navigate(['tasks']);
            }
        });
    }

    loginAction (event) {
        event.preventDefault();
        var userLog = {
            login: this.login,
            password: this.password
        };

        this.usersService.login(userLog).subscribe(response => {
            if (response.status) {
                this.router.navigate(['tasks']);
            }
            else {
                this.password = "";
                this.wrongMessage = response.info.message;
            }
        });
    }

    registrationAction (event) {
        event.preventDefault();
        var user = {
            login: this.loginRegistration,
            password: this.passwordRegistration
        };

        this.usersService.registration(user).subscribe(response => {
            console.log('response', response);
            if (response.status == 'success') {
                this.router.navigate(['tasks']);
            }
            else {
                this.passwordRegistration = "";
                this.wrongMessageRegistration = response.message;
            }
        });
    }
}
