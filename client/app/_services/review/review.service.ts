import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../../app.config';
import { Review } from '../../_models/index';

@Injectable()
export class ReviewService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/reviews', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/reviews/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(review: Review) {
        return this.http.post(this.config.apiUrl + '/reviews/create', review, this.jwt()).map((response: Response) => response.json());
    }

    update(review: Review) {
        return this.http.put(this.config.apiUrl + '/reviews/' + review._id, review, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/reviews/' + _id, this.jwt());
    }

    // private helper methods
    private jwt() {
		if (this.userLoggedIn("user_token") != null) {
			let currentUserToken = JSON.parse(this.getToken("user_token"));
			if (currentUserToken) {
				let headers = new Headers({ 'Authorization': 'Bearer ' + currentUserToken });
				headers.append('Content-Type', 'application/json'); 	
				return new RequestOptions({ headers: headers });
			}
		}
    }
	
	private userLoggedIn(cname: string) {
		var dc = document.cookie;
		var name = cname + "=";
		var begin = dc.indexOf("; " + name);
		if (begin == -1) {
			begin = dc.indexOf(name);
			if (begin != 0) return null;
		} else {
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = dc.length;
			}
		}
		return decodeURI(dc.substring(begin + name.length, end));
	}
	
	private getToken(cname: string) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
}