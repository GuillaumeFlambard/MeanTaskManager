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
  totalEntries: number;
  currentPage: number;
  numberPages: number;
  intervalEntriesMin: number;
  intervalEntriesMax: number;

  constructor(private tasksService: TasksService) {  }

  ngOnInit() {
    // Retrieve tasks from the API
    this.goToPage(null, 1);
  }

  goToPage(event, number) {
    if (event)
    {
      console.log('stopPropagation');
      event.stopPropagation();
    }
    this.countPerPage = 10;
    this.currentPage = number;

    this.tasksService.getTasks(this.currentPage, this.countPerPage).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.tasksService.countAllTasks().subscribe(totalEntries => {
      this.totalEntries = totalEntries;
      this.numberPages = totalEntries / this.countPerPage;
      this.intervalEntriesMax = this.currentPage * this.countPerPage;
      this.intervalEntriesMin = this.intervalEntriesMax - this.countPerPage + 1;
    });
  }

  createPagesNumber(number) {
    number = Math.ceil(number);
    let pages: number[] = [];
    for(let i = 1; i <= number; i++){
      pages.push(i);
    }

    return pages;
  }

  addTask(event) {
    event.preventDefault();
    let newTask = {
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
