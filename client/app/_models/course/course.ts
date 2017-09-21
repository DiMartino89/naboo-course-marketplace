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
    members: any[] = [];
    signInDeadline: any;
    link: string;
    appointments: any;
    duration: number;
    rating: number;
    reviews: any[] = [];
    pictures: string[] = [];
    createdAt: any;
    updatedAt: any;
    owner: any;
}