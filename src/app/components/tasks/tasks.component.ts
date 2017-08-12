import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../../models/Task';
import { Paginator } from '../../../models/Paginator';
import { Filters } from '../../../models/Filters';
import { Socket } from 'ng2-socket-io';
import { CanActivate } from '@angular/router';
import { UsersService } from '../../services/users.service';
import {User} from "../../../models/User";

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.css'],
  providers: [UsersService]
})

export class TasksComponent implements OnInit {
  // instantiate tasks to an empty object
  tasks: Task[];
  title: string;
  countPerPage: number;
  totalEntries: number;
  currentPage: number;
  numberPages: number;
  intervalEntriesMin: number;
  intervalEntriesMax: number;
  paginator: Paginator[] = [];
  filters: Filters;
  user: User;

  constructor(private usersService:UsersService, private tasksService: TasksService, private socket: Socket) {
    this.user = new User;
    this.user = this.usersService.getCurrentUserValue();
  }

  // canActivate() {
  //   return this.usersService.isAuthenticate().subscribe(user => {
  //     if (Object.keys(user).length != 0)
  //     {
  //       return true;
  //     }
  //
  //     return false;
  //   });
  // }

  ngOnInit() {
    // Retrieve tasks from the API
    this.filters = {
      title: '',
      isDone: ''
    };
    this.goToPage(1);

    this.listenerTask()
  }

  /**
   * Listen emit from NodeJS to manage task
   */
  listenerTask(){
    let that = this;
    this.socket.on('addTask', function(task: Task){
      that.pushNewTaskTolist(task, that);
    });
    this.socket.on('deleteTask', function(task){
      that.spliceTask(task, that);
    });
    this.socket.on('checkTask', function(task){
      that.checkTask(task, that);
    });
  }

  filtersAction(event) {
    event.preventDefault();
    this.goToPage(1);
  }

  /**
   * Management of pagination with filters
   * @param number
   */
  goToPage(number) {
    this.countPerPage = 10;
    this.currentPage = number;

    this.tasksService.getTasks(this.currentPage, this.countPerPage, this.filters).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.tasksService.countAllTasks(this.filters).subscribe(totalEntries => {
      this.totalEntries = totalEntries;
      this.numberPages = totalEntries / this.countPerPage;
      this.intervalEntriesMax = this.currentPage * this.countPerPage;
      if (this.intervalEntriesMax > this.totalEntries)
      {
        this.intervalEntriesMax = this.totalEntries;
      }
      this.intervalEntriesMin = this.intervalEntriesMax - this.countPerPage + 1;
      if (this.intervalEntriesMin < 1)
      {
        this.intervalEntriesMin = 0;
      }
      this.createPagesNumber(this.numberPages);
    });
  }

  /**
   * Number and link to other task page
   * @param number
   */
  createPagesNumber(number) {
    number = Math.ceil(number);
    let tmpPaginator = [];
    for(let i = 1; i <= number; i++){
      tmpPaginator.push({ number:i });
    }

    this.paginator = tmpPaginator;
  }

  /**
   * Add task to mongoDB
   * @param event
   */
  addTask(event) {
    event.preventDefault();
    let newTask = {
      title: this.title,
      isDone: false
    };

    this.tasksService.addTask(newTask).subscribe(task => {
      this.title = "";
    });
  }

  /**
   * Push a task to the task list. This function if call after the newTask emit from NodeJS
   * @param task
   * @param that
   */
  pushNewTaskTolist(task, that) {
    if (task.user_id == this.user._id)
    {
      if (that.currentPage == 1) {
        that.tasks.unshift(task);
      } else {
        that.intervalEntriesMin--;
      }
      that.totalEntries++;
      that.intervalEntriesMax++;
      that.createPagesNumber(that.numberPages);
    }
  }

  /**
   * To check or uncheck a task for mongoDB
   * @param task
   */
  updateStatus(task) {
    let _task = {
      _id: task._id,
      title: task.title,
      isDone: !task.isDone
    };

    this.tasksService.updateStatus(_task).subscribe(task => {

    });
  }

  /**
   * Check or uncheck a task in the current task list. This function is call after an emit from NodeJS
   * @param task
   * @param that
   */
  checkTask(task, that)
  {
    if (task.user_id == this.user._id)
    {
      let tasks = that.tasks;

      for (let i = 0;i < tasks.length;i++) {
        if (tasks[i]._id == task._id)
        {
          tasks[i].isDone = !tasks[i].isDone;
        }
      }
    }
  }

  /**
   * To delete a Task in mongoDB
   * @param taskId
   */
  deleteTask(taskId) {
    // event.preventDefault();
    this.tasksService.deleteTask(taskId).subscribe(data => {

    });
  }

  /**
   * To delete task in the current task list. This function is call after an emit from NodeJS
   * @param task
   * @param that
   */
  spliceTask(task, that)
  {
    console.log('task.user_id', task.user_id, 'this.user._id', this.user._id);
    if (task.user_id == this.user._id) {
      let tasks = that.tasks;

      for (let i = 0;i < tasks.length;i++) {
        if (tasks[i]._id == task.id) {
          tasks.splice(i, 1);
          that.intervalEntriesMax--;
        }
      }

      that.totalEntries--;
      that.createPagesNumber(that.numberPages);
    }
  }
}
