import React, { useEffect, useState } from "react";
import { Remult, remult } from "remult";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";
import { observer } from "mobx-react-lite";
import { action, makeAutoObservable, observable, runInAction, createAtom } from 'mobx';


Remult.entityRefInit = (ref, row) => ref.subscribe(createAtom("entity"));

class Store {
  taskRepo = remult.repo(Task);
  readonly tasks = observable<Task>([]);
  hideCompleted = false;
  constructor() {
    makeAutoObservable(this);
    this.taskRepo.addEventListener({
      deleted: action(task => this.tasks.remove(task))
    });
  }
  replaceTasks(t: Task[]) {
    this.tasks.replace(t);
  }
  async loadTasks() {
    this.replaceTasks(await
      this.taskRepo.find({
        limit: 20,
        orderBy: { completed: "asc" },
        where: { completed: this.hideCompleted ? false : undefined }
      }));
  }
  addTask() {
    this.tasks.push(this.taskRepo.create())
  }
  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.loadTasks();
  }
}
const store = new Store();

function App() {
  return <Todo store={store} />
}
const Todo: React.FC<{ store: Store }> = observer(({ store }) => {
  useEffect(() => {
    store.loadTasks()
  }, [store.hideCompleted]);
  return (
    <div>
      <input
        type="checkbox"
        checked={store.hideCompleted}
        onChange={action(e => store.hideCompleted = e.target.checked)} /> Hide Completed
      <main>
        {store.tasks.map(task => {
          return (
            <div key={task.id}>
              <input type="checkbox"
                checked={task.completed}
                onChange={(e => {
                  const prev = task.completed;
                  task.completed = e.target.checked;
                })} />
              <input
                value={task.title}
                onChange={(e => task.title = e.target.value)} />
              <button onClick={async () => {
                try {
                  await task.save();
                } catch (error: any) {
                  alert(error.message);
                }
              }}>Save</button>
              <button onClick={() => task.delete()}>Delete</button>
              <span>{task.$.title.error}</span>
            </div>
          );
        })}

      </main>
      <button onClick={() => store.addTask()}>Add Task</button>
      <div>
        <button onClick={() => store.setAll(true)}>Set all as completed</button>
        <button onClick={() => store.setAll(false)}>Set all as uncompleted</button>
      </div>

    </div>
  );
});


export default App;
