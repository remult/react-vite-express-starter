import { Allow, describeClass, Entity, Fields, Validators } from "remult";
import { Roles } from "./Roles";

export class Task {
      id!: string;
      title = '';
      completed = false;
}

describeClass(Task, Entity<Task>("tasks", {
      allowApiRead: Allow.authenticated,
      allowApiUpdate: Allow.authenticated,
      allowApiInsert: Roles.admin,
      allowApiDelete: Roles.admin
}), {
      id: Fields.uuid(),
      title: Fields.string({
            validate: Validators.required,
            allowApiUpdate: Roles.admin
      }),
      completed: Fields.boolean()
})