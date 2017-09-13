import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';

import { AppConfig } from '../../app.config';
import { User } from '../../_models/index';

@Injectable()
export class UserService {

    viewedUsers: any;

    constructor(private http: Http, 
				private config: AppConfig,
				private authenticationService: AuthenticationService) { }

    create(user: User) {
        return this.http.post(this.config.apiUrl + '/users/register', user).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user._id, user, this.authenticationService.jwt());
    }

    delete(_id: any) {
        return this.http.delete(this.config.apiUrl + '/users/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
	
	getAll() {
        return this.http.get(this.config.apiUrl + '/users', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(_id: any) {
        return this.http.get(this.config.apiUrl + '/users/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    addViewedUser(currUserId: any, userId: any) {
        this.viewedUsers = (JSON.parse(localStorage.getItem(currUserId + '_users')) || []).filter((id) => id !== userId);
        this.viewedUsers.push(userId);

        localStorage.setItem(currUserId + '_users', JSON.stringify(this.viewedUsers.slice(-3)));
    }
}