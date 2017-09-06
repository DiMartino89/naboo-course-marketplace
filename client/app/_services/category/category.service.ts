import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Select2OptionData } from 'ng2-select2';
import { AppConfig } from '../../app.config';

@Injectable()
export class CategoryService {

	categories: {};

    constructor(private http: Http, 
				private config: AppConfig) { }
	
    getCategoriesList(): Select2OptionData[] {
        return [
            {
                id: 'music',
                text: 'Music',
                children: [
                    {
                        id: 'band',
                        text: 'Band'
                    },
					{
						id: 'instruments',
						text: 'Instrumente'
					},
					{
						id: 'vocals',
						text: 'Vocals'
					}
				]
            },
			{
                id: 'arts',
                text: 'Arts',
                children: [
                    {
                        id: 'drawing',
                        text: 'Drawing'
                    },
					{
						id: 'mosaic',
						text: 'Mosaic'
					},
					{
						id: 'woodwork',
						text: 'Woodwork'
					}
				]
            },
			{
                id: 'cooking',
                text: 'Cooking',
                children: [
                    {
                        id: 'mediterran',
                        text: 'Mediterran'
                    },
					{
						id: 'vegetarian',
						text: 'Vegetarian'
					},
					{
						id: 'grecian',
						text: 'Grecian'
					}
				]
            },
			{
                id: 'sports',
                text: 'Sports',
                children: [
                    {
                        id: 'football',
                        text: 'Football'
                    },
					{
						id: 'tennis',
						text: 'Tennis'
					},
					{
						id: 'volleyball',
						text: 'Volleyball'
					}
				]
            }
		];
	}
}