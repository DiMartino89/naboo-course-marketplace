import {Component, Input, OnInit} from '@angular/core';

declare const $;

@Component({
    moduleId: module.id,
    selector: 'app-modal-link',
    templateUrl: 'modal-link.component.html'
})
export class ModalLinkComponent implements OnInit {

    @Input() modal: string;

    constructor() {
    }

    ngOnInit() {
    }

    openModal() {
        $('#' + this.modal).messageModal('show');
    }

}
