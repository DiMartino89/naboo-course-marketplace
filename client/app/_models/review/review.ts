import { User } from '../index';

export class Review {
    _id: string;
	user: User;
	rating: number;
	description: string;
	createdAt: any;
	updatedAt: any;
}