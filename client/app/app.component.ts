import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService, AlertService, AuthenticationService} from './_services/index';
import {TranslateService} from "./translate/translate.service";

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
    currentUser: any = {};

    messages: number = 0;
    difference: number = 0;

    public currentLanguage: string;
    public translatedText: string;
    public supportedLanguages: any[];

    constructor(private router: Router,
                private _translate: TranslateService,
                private userService: UserService,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            this.userService.getById(JSON.parse(this.authenticationService.getUserParam("user_id"))).subscribe(user => {
                this.currentUser = user;

                Object.keys(user.messages).forEach((key) => {
                    for (let i = 0; i < user.messages[key].length; i++) {
                        this.messages++;
                    }
                });

                this.difference = this.messages - parseInt(JSON.parse(localStorage.getItem(user._id + '_messages')));

                if (this.difference > 0) {
                    $('.message-news').html('<small class="notification">' + this.difference + '</small><i class="fa fa-envelope-o"></i>');
                }
            });
        }
    }

    ngOnInit() {
        if (!this.isLoggedIn()) {
            $('.content').addClass('log');
            $('.main-container').addClass('log');
        }

        this.supportedLanguages = [
            {display: 'Deutsch', value: 'de'},
            {display: 'Englisch', value: 'en'}
        ];

        this.currentLanguage = localStorage.getItem('language');
        this.selectLang(this.currentLanguage);
    }

    showPanel() {
        $('.user-panel').toggleClass('active');
    }

    setActive(event) {
        $('.sidebar li a').removeClass('active');
        $(event.target).parent().addClass('active');
    }

    isLoggedIn() {
        if (this.authenticationService.userLoggedIn("user_token") != null) {
            return true;
        } else {
            return false;
        }
    }

    selectLang(lang: string) {
        this._translate.use(lang);
        this.refreshText();
        localStorage.removeItem('language');
        localStorage.setItem('language', lang);
    }

    refreshText() {
        this.translatedText = this._translate.instant('hello world');
    }

    private showSub(classname: string, selector: string) {
        $(classname).slideToggle();
        $(selector).toggleClass('active');
    }

    private logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        this.alertService.success('Erfolgreich ausgeloggt!', true);
        this.isLoggedIn();
    }
}