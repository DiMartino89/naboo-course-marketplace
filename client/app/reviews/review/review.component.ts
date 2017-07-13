import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Review, User } from '../../_models/index';
import { ReviewService } from '../../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'review.component.html'
})

export class ReviewComponent implements OnInit {
    /* User Stuff */
	currentUser: User;
	
	/* Review Stuff */
	review: Review;
    reviews: Review[] = [];
	reviewId: string;

    constructor(private reviewService: ReviewService, 
				private activatedRoute: ActivatedRoute) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllReviews();
		this.activatedRoute.params.subscribe((params: Params) => {
			this.reviewId = params['id'];
		});
    }

    deleteReview(_id: string) {
        this.reviewService.delete(_id).subscribe(() => { this.loadAllReviews() });
    }

    private loadAllReviews() {
        this.reviewService.getAll().subscribe(reviews => { this.reviews = reviews; });
    }
}