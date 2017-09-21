import {Component, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-review',
    templateUrl: 'review.component.html'
})

export class ReviewComponent {
    @Input() rating: number;

    constructor() {
    }
}