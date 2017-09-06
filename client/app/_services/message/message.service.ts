import { Injectable, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../app.config';
import { Message } from '../../_models/message/message';

@Injectable()
export class MessageService {
    sentMessages: Message[];
    receivedMessages: Message[];
    archivedMessages: Message[];
    unread: number;

    constructor(private http: Http,
                private config: AppConfig,
                private ngZone: NgZone,
                private authService: AuthenticationService) {
        this.sentMessages = null;
        this.receivedMessages = null;
        this.archivedMessages = null;
        this.unread = 0;
    }

    send(message: Message) {
        return this.http.post(this.config.apiUrl + '/messages', message, this.authService.jwt())
                   .map((response: Response) => {
                       const sentMessage = response.json();

                       if (this.sentMessages) {
                           this.sentMessages.unshift(sentMessage);
                       }

                       return sentMessage;
                   });
    }

    getSent() {
        if (this.sentMessages) {
            return this.observableContent(this.sentMessages.sort((a, b) => a.created_at > b.created_at ? -1 : 1));
        }

        return this.http.get(this.config.apiUrl + '/messages?type=sent', this.authService.jwt())
                   .map((response: Response) => {
                       this.sentMessages = response.json()
                           ? response.json().filter((message) => !message.archived)
                           : [];
                       return this.sentMessages;
                   });
    }

    getReceived() {
        if (this.receivedMessages) {
            return this.observableContent(this.receivedMessages.sort((a, b) => a.created_at > b.created_at ? -1 : 1));
        }

        return this.http.get(this.config.apiUrl + '/messages?type=received', this.authService.jwt())
                   .map((response: Response) => {
                       this.receivedMessages = response.json()
                           ? response.json().filter((message) => !message.archived)
                           : [];
                       return this.receivedMessages;
                   });
    }

    getArchived() {
        if (this.archivedMessages) {
            return this.observableContent(this.archivedMessages.sort((a, b) => a.created_at > b.created_at ? -1 : 1));
        }

        return this.http.get(this.config.apiUrl + '/messages?type=archived', this.authService.jwt())
                   .map((response: Response) => {
                       this.archivedMessages = response.json();
                       return this.archivedMessages;
                   });
    }

    getById(id: number) {
        const requests = [];

        requests.push(this.getSent());
        requests.push(this.getReceived());
        requests.push(this.getArchived());

        return Observable.forkJoin(requests).map(() => {
            const messages = this.sentMessages.concat(this.receivedMessages).concat(this.archivedMessages)
                                 .filter((message) => message.id === id);

            if (messages.length > 0) {
                return messages[0];
            }

            return null;
        });
    }

    markRead(id: number, read = true) {
        return this.http.patch(this.config.apiUrl + '/messages/' + id, { read }, this.authService.jwt())
                   .map((response: Response) => {
                       this.invalidateCache();
                       return response;
                   });
    }

    markArchived(id: number, archived = true) {
        return this.http.patch(this.config.apiUrl + '/messages/' + id, { archived }, this.authService.jwt())
                   .map((response: Response) => {
                       this.invalidateCache();
                       return response;
                   });
    }

    remove(id: number) {
        return this.http.delete(this.config.apiUrl + '/messages/' + id, this.authService.jwt())
                   .map((response: Response) => {
                       this.deleteFromCaches(id);
                       return response;
                   });
    }

    invalidateCache() {
        this.archivedMessages = null;
        this.receivedMessages = null;
        this.sentMessages = null;
    }

    checkForNewMessages() {
        if(this.authService.isEnabled) {
            this.getReceived().subscribe((messages: Message[]) => {
                this.ngZone.run(() => {
                    this.unread = messages.filter((message) => !message.read).length;
                });
            });
        }
    }

    private deleteFromCaches(id: number) {
        if (this.receivedMessages) {
            this.receivedMessages = this.receivedMessages.filter((m: Message) => m.id !== id);
        }

        if (this.sentMessages) {
            this.sentMessages = this.sentMessages.filter((m: Message) => m.id !== id);
        }

        if (this.archivedMessages) {
            this.archivedMessages = this.archivedMessages.filter((m: Message) => m.id !== id);
        }
    }

    private observableContent(content) {
        return new Observable((observer) => {
            observer.next(content);
            observer.complete();
        });
    }
}
