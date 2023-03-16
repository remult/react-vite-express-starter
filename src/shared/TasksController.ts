import { Allow, BackendMethod, describeClass, remult } from "remult";
import { Task } from "./Task";
import { Roles } from "./Roles";

export class TasksController {
   static async setAll(completed: boolean) {
      const taskRepo = remult.repo(Task);

      for (const task of await taskRepo.find()) {
            await taskRepo.save({ ...task, completed });
      }
   }
}

describeClass(TasksController, undefined, undefined, {
   setAll: BackendMethod({ allowed: Roles.admin })
})