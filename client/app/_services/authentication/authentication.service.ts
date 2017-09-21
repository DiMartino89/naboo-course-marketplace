import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {AppConfig} from '../../app.config';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http,
                private config: AppConfig) {
    }

    login(email: string, password: string, stay_loggedIn: boolean) {
        return this.http.post(this.config.apiUrl + '/users/login', {email: email, password: password})
            .map((response: Response) => {
                let user = response.json();
                if (stay_loggedIn) {
                    if (user) {
                        this.setUserParam("user_id", JSON.stringify(user._id), false);
                        this.setUserParam("user_token", JSON.stringify(user.token), false);
                    }
                } else {
                    this.setUserParam("user_id", JSON.stringify(user._id), true);
                    this.setUserParam("user_token", JSON.stringify(user.token), true);
                }
            });
    }

    logout() {
        document.cookie = "user_id" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "user_token" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

    jwt() {
        if (this.userLoggedIn("user_token") != null) {
            let currentUserToken = JSON.parse(this.getUserParam("user_token"));
            if (currentUserToken) {
                let headers = new Headers({'Authorization': 'Bearer ' + currentUserToken});
                headers.append('Content-Type', 'application/json');
                return new RequestOptions({headers: headers});
            }
        }
    }

    userLoggedIn(cname: string) {
        let dc = document.cookie;
        let name = cname + "=";
        let begin = dc.indexOf("; " + name);
        let end: number;
        if (begin == -1) {
            begin = dc.indexOf(name);
            if (begin != 0) return null;
        } else {
            begin += 2;
            end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        return decodeURI(dc.substring(begin + name.length, end));
    }

    setUserParam(cname: string, cvalue: string, exp: boolean) {
        if (exp) {
            let expiration_date = new Date();
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            document.cookie = cname + "=" + cvalue + "; expires=" + expiration_date.toUTCString() + "; " + "path=/;";
        } else {
            document.cookie = cname + "=" + cvalue + "; path=/;";
        }
    }

    getUserParam(cname: string) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    getById(_id: any) {
        return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
    }
}