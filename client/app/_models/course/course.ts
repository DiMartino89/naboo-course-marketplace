import { Review, User } from '../index';

export class Course {
    _id: string; 
	name: string;
	description: string;
	categories: string[];
	image: string;
	address_name: string;
	street: string;
	district: string;
    city: string;
	country: string;
	latitude: number;
	longitude: number;	
	members: User[] = [];
	link: string;	
	date: any;
	duration: number;
	rating: number;
	reviews: Review[] = [];
	pictures: string[] = [];
	createdAt: any;
	updatedAt: any;
	owner: User;
}