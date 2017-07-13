import { Review, Course } from '../index';

export class User {
    _id: string;
	enabled: boolean;
	email: string;
    name: string;
    password: string;
	role: string;
	description: string;
	avatar: string;
	titleImage: string;
	pictures: string[] = [];
	courses: Course[] = [];
	friendRequests: any[] = [];
	friends: any[] = [];
	reviews: Review[] = [];
	rating: number;
	createdAt: any;
	updatedAt: any;
}