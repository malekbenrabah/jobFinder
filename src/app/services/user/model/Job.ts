import{Skill} from"./Skill";
import{User} from "./user";

export enum JobType {

    Full_Time='Full_Time',
    Part_Time='Part_Time',
    Intern='Intern'
}

export enum Sector {

    computer_science,
    finance,
    accounting,
    consulting,
    tourism,
    paramedical,
    health_care,
    biology,
    law,
    media,
    others,
}

export class Job{

    id!:number;
    title!:string;
    description!:string;
    jobType!:JobType;
    experience!:number;
    created_at!: any[];
    location!:string;
    deadline!:any[];
    sector!:Sector;
    diploma!:string;
    companyName!:string;
    companyPhoto!:string;
    companyEmail!:string;
    companyAdresse!:string;
    companyPhone!:string;
    companyAbout!:string;
    skills!:Skill[];
    users!:User[];
    

}