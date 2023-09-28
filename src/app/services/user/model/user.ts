import { Education } from "./Education";
import { Experience } from "./Experience";
import{Skill} from"./Skill";

export class User {
    id!: number;
    firstname!: string;
    lastname!: string;
    email!: string;
    role!: string;
    photo!:any;
    created_at!:any;
    phone!:number;
    companyName!:string;
    adresse!:string;
    aboutMe!:string;
    skills!:Skill;
    experiences!:Experience;
    educations!:Education;
    candidateSkills!:Skill[]
}