import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthenticationService } from '../index';

import { AppConfig } from '../../app.config';
import { User } from '../../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http, 
				private config: AppConfig,
				private authenticationService: AuthenticationService) { }

    create(user: User) {
        return this.http.post(this.config.apiUrl + '/users/register', user).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user._id, user, this.authenticationService.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/users/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
	
	getAll() {
        return this.http.get(this.config.apiUrl + '/users', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/users/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}