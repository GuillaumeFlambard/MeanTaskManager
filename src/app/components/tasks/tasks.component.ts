import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../../models/Task';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.css']
})
export class TasksComponent implements OnInit {
  // instantiate tasks to an empty object
  tasks: Task[];
  title: string;
  countPerPage: number;
  countResult: number;
  currentPage: number;
  numberPages: number;

  constructor(private tasksService: TasksService) { console.log('constructor'); }

  ngOnInit() {
    // Retrieve tasks from the API
    console.log('Init tasks');
    this.countPerPage = 10;
    this.currentPage = 1;
    this.tasksService.getAllTasks(this.currentPage, this.countPerPage).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.tasksService.countAllTasks().subscribe(countResult => {
      this.countResult = countResult;
      this.numberPages = countResult/this.countPerPage;
    });
  }

  createPagesNumber(number) {
    var pages: number[] = [];
    for(var i = 1; i <= number; i++){
      pages.push(i);
    }
    return pages;
  }

  addTask(event) {
    event.preventDefault();
    var newTask = {
      title: this.title,
      isDone: false
    };

    this.tasksService.addTask(newTask).subscribe(task => {
      this.tasks.unshift(task);
      this.title = "";
    });
  }

  updateStatus(task) {
    var _task = {
      _id: task._id,
      title: task.title,
      isDone: !task.isDone
    };

    this.tasksService.updateStatus(_task).subscribe(task => {
      task.isDone = !task.isDone;
    });
  }

  deleteTask(taskId) {
    // event.preventDefault();

    var tasks = this.tasks;
    this.tasksService.deleteTask(taskId).subscribe(data => {
      if (data.n == 1)
      {
        for (var i = 0;i < tasks.length;i++) {
            if (tasks[i]._id == taskId)
            {
              tasks.splice(i, 1);
            }
          }
      }
    });
  }
}
