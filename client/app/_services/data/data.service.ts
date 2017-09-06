import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    public file: string = '';
    public files: string = '';
    public latitude: number;
    public longitude: number;
    public events: string[];

    constructor() {}
}