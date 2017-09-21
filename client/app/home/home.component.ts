import {Component, OnInit} from '@angular/core';
import {User, Course} from '../_models/index';
import {AuthenticationService, UserService, CourseService} from '../_services/index';
import {MapsAPILoader} from '@agm/core';

declare var google: any;

@Component({
    moduleId: module.id,
    styleUrls: ['./home.css'],
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: any = {};

    users: User[] = [];
    user: any = {};

    courses: Course[] = [];
    addresses: any = [];
    course: any = {};

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private courseService: CourseService,
                private mapsAPILoader: MapsAPILoader,) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;
            });
        }
    }

    ngOnInit() {
        this.courseService.getAll().subscribe(
            courses => {
                this.courses = courses;
                this.sortCourses('createdAt');

                let addresses = [];

                this.mapsAPILoader.load().then(() => {
                    const geocoder = new google.maps.Geocoder();
                    for (let i = 0; i < courses.length; i++) {
                        let latlng = new google.maps.LatLng(courses[i].latitude, courses[i].longitude);
                        let request = {
                            latLng: latlng
                        };
                        geocoder.geocode(request, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                addresses.push(results[1].formatted_address);
                            } else {
                                console.log('Error getting address');
                            }
                        });
                    }
                });
                this.addresses = addresses;
            }
        );

        $("li[role='tab']").click(function () {
            $("li[role='tab']").attr("aria-selected", "false");
            $("li[role='tab']").removeClass('active');
            $(this).attr("aria-selected", "true");
            $(this).addClass("active");
            $("div[role='tabpanel']").addClass('hidden');
            $("#" + $(this).attr("aria-controls")).removeClass('hidden');
        });
    }

    sortCourses(kind: string) {
        const direction = 'desc';

        this.courses = this.courses.sort((a, b) => {
            if (a[kind] > b[kind] && direction === 'desc') {
                return -1;
            } else if (a[kind] < b[kind] && direction === 'desc') {
                return 1;
            } else {
                return 0;
            }
        });
    }

    changeDateFormat(dateInput: any) {
        let date = new Date(dateInput);
        return [('0' + date.getDate()).slice(-2), ('0' + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(
            '.') + ' ' + [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)].join(':');
    }
}