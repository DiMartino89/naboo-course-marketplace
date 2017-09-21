import {Component, OnInit} from '@angular/core';
import {UserService} from '../../_services/user/user.service';
import {CourseService} from "../../_services/course/course.service";
import {Course} from "../../_models/course/course";
import {AuthenticationService} from "../../_services/authentication/authentication.service";
import {User} from "../../_models/user/user";

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
    currentUser: any = {};

    userRequests: any = [];
    viewedUsers: any = [];
    userMessages: any = [];
    userCourses: any = [];
    bookedCourses: any = [];
    viewedCourses: any = [];

    inboxSenders: any = [];

    requester: any;
    receiver: any;

    courses: Course[];

    constructor(private userService: UserService,
                private courseService: CourseService,
                public authenticationService: AuthenticationService) {

        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
                for (let i = 0; i < user.friendRequests.length; i++) {
                    this.userService.getById(user.friendRequests[i]).subscribe(user => {
                        this.userRequests.push(user);
                    });
                }
                for (let i = 0; i < user.courses.length; i++) {
                    this.courseService.getById(user.courses[i]).subscribe(course => {
                        this.userCourses.push(course);
                    });
                }
                for (let i = 0; i < user.bookedCourses.length; i++) {
                    this.courseService.getById(user.bookedCourses[i]).subscribe(course => {
                        this.bookedCourses.push(course);
                    });
                }
                Object.keys(user.messages).forEach((key) => {
                    this.userService.getById(key).subscribe(user => {
                        this.userMessages.push(user);
                    });
                });
                this.userMessages.reverse();
                this.getViewedCourses(user._id);
                this.getViewedUsers(user._id);
            });
        }
    }

    ngOnInit() {
    }

    private getViewedUsers(currUserId: any) {
        let users = [];
        const viewedUsers = JSON.parse(localStorage.getItem(currUserId + '_users'));

        if (viewedUsers != null) {
            users = viewedUsers;
            users = users.reverse();
        }

        for (let i = 0; i < users.length; i++) {
            this.userService.getById(users[i]).subscribe(
                (user: User) => {
                    this.viewedUsers.push(user);
                }
            );
        }
    }

    private getViewedCourses(currUserId: any) {
        let courses = [];
        const viewedCourses = JSON.parse(localStorage.getItem(currUserId + '_courses'));

        if (viewedCourses != null) {
            courses = viewedCourses;
            courses = courses.reverse();
        }

        for (let i = 0; i < courses.length; i++) {
            this.courseService.getById(courses[i]).subscribe(
                (course: Course) => {
                    this.viewedCourses.push(course);
                }
            );
        }
    }

    acceptFriendRequest(user: User) {
        this.receiver = this.currentUser;
        this.requester = user;
        this.receiver.friends.push(this.requester._id);
        this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
        this.userService.update(this.receiver).subscribe(() => {
        });
        this.requester.friends.push(this.receiver._id);
        this.userService.update(this.requester).subscribe(() => {
        });
    }

    refuseFriendRequest(user: User) {
        this.receiver = this.currentUser;
        this.requester = user;
        this.receiver.friendRequests.splice(this.receiver.friendRequests.indexOf(this.requester._id), 1);
        this.userService.update(this.receiver).subscribe(() => {
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}
