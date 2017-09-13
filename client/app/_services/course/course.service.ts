import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthenticationService } from '../index';

import { AppConfig } from '../../app.config';
import { Course } from '../../_models/index';

@Injectable()
export class CourseService {

    viewedCourses: any;

    constructor(private http: Http, 
				private config: AppConfig,
				private authenticationService: AuthenticationService) { }

    create(course: Course) {
        return this.http.post(this.config.apiUrl + '/courses/create', course, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(course: Course) {
        return this.http.put(this.config.apiUrl + '/courses/' + course._id, course, this.authenticationService.jwt());
    }

    delete(_id: any) {
        return this.http.delete(this.config.apiUrl + '/courses/' + _id, this.authenticationService.jwt());
    }
	
	getAll() {
        return this.http.get(this.config.apiUrl + '/courses', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(_id: any) {
        return this.http.get(this.config.apiUrl + '/courses/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    addViewedCourse(currUserId: any, courseId: any) {
        this.viewedCourses = (JSON.parse(localStorage.getItem(currUserId + '_courses')) || []).filter((id) => id !== courseId);
        this.viewedCourses.push(courseId);

        localStorage.setItem(currUserId + '_courses', JSON.stringify(this.viewedCourses.slice(-3)));
    }
}