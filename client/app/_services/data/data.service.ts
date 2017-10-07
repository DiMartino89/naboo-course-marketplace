import {Injectable} from '@angular/core';

@Injectable()
export class DataService {
    public avatar: string = '';
    public titleImage: string = '';
    public pictures: string = '';
    public latitude: number;
    public longitude: number;
    public events: string[];
	public reviewers: any[];

    constructor() {
    }
}