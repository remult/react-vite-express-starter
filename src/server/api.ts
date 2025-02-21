import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/Task.js"

export const api = remultExpress({
    entities: [Task],
    admin: true,
})