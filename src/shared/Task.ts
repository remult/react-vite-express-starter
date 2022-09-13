import { makeAutoObservable } from "mobx";
import { Allow, Entity, Fields, Validators } from "remult";
import { Roles } from "./Roles";

@Entity<Task>("tasks", {
  allowApiRead: Allow.authenticated,
  allowApiUpdate: Allow.authenticated,
  allowApiInsert: Roles.admin,
  allowApiDelete: Roles.admin
})
export class Task {
  constructor() {
    makeAutoObservable(this);
  }
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: Validators.required,
    allowApiUpdate: Roles.admin
  })
  title = '';

  @Fields.boolean()
  completed = false;
}
