import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParams, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskService {

  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = uuid()
    task.status = TaskStatusEnum.TO_DO
    this.tasks.push(task)
    console.log(this.tasks)
  }

  findById(id: string): TaskDto {
    const foundTask = this.tasks.filter(t => t.id == id)
    if (foundTask.length) {
      return foundTask[0]
    }
    throw new HttpException(`Task with ${id} not found`, HttpStatus.BAD_REQUEST)
  }

  findAll(params: FindAllParams): TaskDto[] {
    return this.tasks.filter(t => {
      let match = true

      if (params.title != undefined && t.title.includes(params.title)) {
        match = false
      }

      if(params.status != undefined && t.status.includes(params.status)) {
        match = false
      }
      return match
    })
  }

  update(task: TaskDto) {
    const index = this.tasks.findIndex(t => t.id === task.id)
    if (index >= 0) {
      this.tasks[index] = task
      return
    }
    throw new HttpException(`Task with ${task.id} not found`, HttpStatus.BAD_REQUEST)
  }

  delete(id: string) {
    const index = this.tasks.findIndex(t => t.id === id)
    if (index >= 0) {
      this.tasks.splice(index, 1)
      return
    }
    throw new HttpException(`Task with ${id} not found`, HttpStatus.BAD_REQUEST)
  }
}
