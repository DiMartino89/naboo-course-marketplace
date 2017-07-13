import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Category, User } from '../../_models/index';
import { CategoryService, UserService, AlertService } from '../../_services/index';


@Component({
    moduleId: module.id,
    templateUrl: 'category_create.component.html'
})

export class CreateCategoryComponent implements OnInit {
	category: Category = new Category();
	currentUser: User;
	
	constructor(private router: Router,
				private categoryService: CategoryService,	
				private userService: UserService,
				private alertService: AlertService) {
					if (this.userLoggedIn("user_id") != null) {
						this.userService.getById(JSON.parse(this.userLoggedIn("user_id"))).subscribe(user => { this.currentUser = user; });
					}
    }

    ngOnInit() {}
	
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
	
	createCategory() {
		
		if((<HTMLInputElement>document.getElementById('category-description')).value.length == 0) {
			this.category.description = '';
		}
		
		this.category.icon = '';
		
		var date = new Date();
		this.category.createdAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + date.getMonth()).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		this.category.updatedAt = ('0' + date.getDate()).slice(-2) + "." + ('0' + date.getMonth()).slice(-2) + "." + date.getFullYear() + " " + ('0' + date.getHours()).slice(-2) + ":" + 						('0' + date.getMinutes()).slice(-2);
		
		this.categoryService.create(this.category).subscribe(
			category => { 
				this.alertService.success('Category successfully created', true);
			},
			error => {
                this.alertService.error(error._body);
            });
    }
}