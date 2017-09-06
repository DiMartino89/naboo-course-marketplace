import { Review, User } from '../index';

export class Course {
    _id: string; 
	name: string;
	description: string;
	categories: string[];
	price: number;
    titleImage: string;
	latitude: number;
	longitude: number;
	maxMembers: number;
	members: User[] = [];
	signInDeadline: any;
	link: string;	
	appointments: any;
	duration: number;
	rating: number;
	reviews: Review[] = [];
	pictures: string[] = [];
	createdAt: any;
	updatedAt: any;
	owner: User;
}