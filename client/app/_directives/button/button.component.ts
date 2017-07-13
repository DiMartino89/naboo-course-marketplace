import { Component, Input } from '@angular/core';

@Component({
	moduleId: module.id,
    selector: 'app-button',
    templateUrl: 'button.component.html'
})
export class ButtonComponent {
    @Input() type: string;
    @Input() htmlType = 'submit';
    @Input() disabled: boolean;
    @Input() tabindex: number;
    @Input() size: string;

    constructor() {
    }
}
