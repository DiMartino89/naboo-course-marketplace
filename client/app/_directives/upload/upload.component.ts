import { Component, Input, OnInit } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { AuthenticationService, AlertService } from "../../_services/index";
import {DataService} from "../../_services/data/data.service";

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'app-upload',
    templateUrl: './upload.component.html'
})
export class UploadComponent implements OnInit {
    @Input() kind: string;
    @Input() single: boolean;
    @Input() multiple: boolean;

    public avatarUploader:FileUploader;
    public uploader:FileUploader;
    public multipleUploader:FileUploader;

    file: string = '';
    files: string[] = [];

    constructor(private authenticationService: AuthenticationService,
                private alertService: AlertService,
                private dataService: DataService) {}

    ngOnInit() {
        //Single File-Uploader TitleImage
        this.uploader = new FileUploader({
            url: 'http://localhost:3001/uploads/' + this.kind,
            headers: [{name:'Accept', value:'application/json'}],
            authToken: 'Bearer ' + JSON.parse(this.authenticationService.getUserParam('user_token'))
        });
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };

        this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

        //Multiple File-Uploader
        this.multipleUploader = new FileUploader({
            url: 'http://localhost:3001/uploads/' + this.kind,
            headers: [{name:'Accept', value:'application/json'}],
            authToken: 'Bearer ' + JSON.parse(this.authenticationService.getUserParam('user_token'))
        });
        this.multipleUploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };

        this.multipleUploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
        this.multipleUploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    }

    onSuccessItem(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any {
        //Single File
        if(response.includes("$")) {
            this.dataService.avatar = response.replace('$', '');
        }

        if(!response.includes(",") && !response.includes("$")) {
            this.dataService.titleImage = response;
        }

        //Multiple Files
        if(response.includes(",")) {
            this.dataService.pictures += response;
        }
    }

    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
        this.alertService.error('Image Upload was not successful, please try again later!');
    }

    public clearInput() {
        $('.file').val('');
    }

    public clearInput2() {
        $('.files').val('');
    }
}