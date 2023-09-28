import { JobType } from "./Job";
import { Skill } from "./Skill";

export class JobAlert {
    id!:number;
    experience!:number;
    location!:string;
    jobType!:JobType;
    created_at!:any[];
    skills!:Skill[];
}