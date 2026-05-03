import { User } from "./User";

export interface taskDTO {
    id:number,
    title:string,
    description:string,
    dueDate:Date,
    priority:string,
    taskStatus:string,
    funcionarioId:number,
    funcionarioName:string
}