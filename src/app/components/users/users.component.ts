import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../../models/User';
import { Router } from '@angular/router';

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.css'],
})

export class UsersComponent implements OnInit {

    users: User[];
    currentUser: User;
    login: string;
    password: string;
    wrongMessage: string;
    loginRegistration: string;
    passwordRegistration: string;
    wrongMessageRegistration: string;

    constructor(private usersService: UsersService, private router:Router) {
        console.log('Construct user');
    }

    ngOnInit() {
        console.log('Init user');
        this.isAuthenticate();
    }

    isAuthenticate () {
        this.usersService.isAuthenticate().subscribe(user => {
            if (Object.keys(user).length != 0)
            {
                this.currentUser = user.user;
                this.usersService.setUser(user.user);
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
                this.usersService.setUser(response.user);
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
            if (response.status) {
                this.router.navigate(['tasks']);
            }
            else {
                this.passwordRegistration = "";
                this.wrongMessageRegistration = response.message;
            }
        });
    }
}
