import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Select2OptionData } from 'ng2-select2';
import { AppConfig } from '../../app.config';
import { Category } from '../../_models/index';
import { AuthenticationService } from '../index';

@Injectable()
export class CategoryService {
    constructor(private http: Http, 
				private config: AppConfig
				private authenticationService: AuthenticationService) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/categories', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/categories/' + _id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(category: Category) {
        return this.http.post(this.config.apiUrl + '/categories/create', category, this.authenticationService.jwt());
    }

    update(category: Category) {
        return this.http.put(this.config.apiUrl + '/categories/' + category._id, category, this.authenticationService.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/categories/' + _id, this.authenticationService.jwt());
    }
	
    getCategoriesList(): Select2OptionData[] {
        return [
			{
				id: 'art',
				text: 'Art'
			},
			{
				id: 'music',
				text: 'Music'
			},
			{
				id: 'sport',
				text: 'Sport'
			}
		];
	}
}