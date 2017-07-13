import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Category, User } from '../../_models/index';
import { CategoryService, UserService } from '../../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'category.component.html'
})

export class CategoryComponent implements OnInit {
    /* User Stuff */
	currentUser: User;
	
	/* Category Stuff */
	category: Category;
    categories: Category[] = [];
	categoryId: string;

    constructor(private categoryService: CategoryService, 
				private userService: UserService,
				private activatedRoute: ActivatedRoute) {
		if (this.userLoggedIn("user_id") != null) {
			this.userService.getById(JSON.parse(this.userLoggedIn("user_id"))).subscribe(user => { this.currentUser = user; });
		}
	}

    ngOnInit() {
        this.loadAllCategories();
		this.activatedRoute.params.subscribe((params: Params) => {
			this.categoryId = params['id'];
		});
    }
	
	private userLoggedIn(name: string) {
		var dc = document.cookie;
		var prefix = name + "=";
		var begin = dc.indexOf("; " + prefix);
		if (begin == -1) {
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		} else {
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = dc.length;
			}
		}
		return decodeURI(dc.substring(begin + prefix.length, end));
	}

    deleteCategory(_id: string) {
        this.categoryService.delete(_id).subscribe(() => { this.loadAllCategories() });
    }

    private loadAllCategories() {
        this.categoryService.getAll().subscribe(categories => { this.categories = categories; });
    }
}