import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UsersComponent } from './components/users/users.component';

import { TasksService } from './services/tasks.service';
import { UsersService } from './services/users.service';

const ROUTES = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: UsersComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [TasksService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
