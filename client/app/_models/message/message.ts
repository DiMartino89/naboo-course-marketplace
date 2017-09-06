import { Course, User } from '../index';

export class Message {
    id: number;
    subject: string;
    text: string;
    from: User;
    to: User;
    course: Course;
    read: boolean;
    archived: boolean;
    created_at: Date;
}
