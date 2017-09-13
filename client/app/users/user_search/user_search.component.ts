import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, UserService, AlertService} from '../../_services/index';
import {ReviewService} from "../../_services/review/review.service";
import {CategoryService} from "../../_services/category/category.service";
import {Select2OptionData} from "ng2-select2";
import {NouisliderComponent} from 'ng2-nouislider';
import {User} from "../../_models/user/user";

declare var $: any;

@Component({
    styleUrls: ['./user_search.css'],
    moduleId: module.id,
    templateUrl: 'user_search.component.html'
})

export class SearchUserComponent implements OnInit {

    @ViewChild('sliderRef') sliderRef: NouisliderComponent;

    searchForm: FormGroup;

    currentUser: any = {};
    users: User[] = [];

    public sliderMax: number;

    public categories: Array<Select2OptionData>;
    public options: Select2Options;
    public value: string[];

    constructor(private formBuilder: FormBuilder,
                private userService: UserService,
                private categoryService: CategoryService,
                private authenticationService: AuthenticationService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }
    }

    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            fulltext: ['', [Validators.maxLength(63)]]
        });

        this.searchUsers();
    }

    searchUsers() {
        this.userService.getAll().subscribe(users => {
            this.users = users;
            const search = this.searchForm.value;
            let searchedUsers: any = [];
            for (let i = 0; i < this.users.length; i++) {
                let fulltext = false;
                Object.keys(this.users[i]).forEach((ckey) => {
                    if (search.fulltext.length > 0) {
                        if (ckey === 'name') {
                            if (this.users[i][ckey].includes(search.fulltext)) {
                                fulltext = true;
                            }
                        }
                    } else {
                        fulltext = true;
                    }
                });
                if (fulltext) {
                    searchedUsers.push(this.users[i]);
                }
            }
            this.users = searchedUsers;
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}