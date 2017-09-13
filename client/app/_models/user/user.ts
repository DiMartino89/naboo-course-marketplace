import { Review, Course } from '../index';

export class User {
    _id: string;
	enabled: boolean;
	email: string;
    name: string;
    password: string;
	description: string;
	avatar: string;
	titleImage: string;
	pictures: string[] = [];
	courses: any[] = [];
	bookedCourses: any[] = [];
	friendRequests: any[] = [];
	friends: any[] = [];
	messages: any = {};
	createdAt: any;
	updatedAt: any;
}