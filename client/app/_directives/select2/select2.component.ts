import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Select2OptionData} from 'ng2-select2';

@Component({
    moduleId: module.id,
    selector: 'app-select2',
    templateUrl: './select2.component.html'
})
export class Select2Component implements OnInit {

    /**
     * Reactive form the select is connected to.
     */
    @Input() form: FormGroup;

    /**
     * Field inside the form the select corresponds to.
     */
    @Input() field: string;

    /**
     * Data displayed inside of the select.
     */
    @Input() data: Select2OptionData[];

    /**
     * Options to configure the select.
     */
    @Input() options: Select2Options;

    /**
     * Whether the input should be displayed in a horizontal form (bootstrap style).
     */
    @Input() horizontal = false;

    /**
     * Label of form input.
     */
    @Input() label: string;

    /**
     * Error text to show on field error.
     */
    @Input() errorText: string;

    /**
     * Whether the field should be marked as required.
     */
    @Input() required = false;

    /**
     * Tabindex of input.
     */
    @Input() tabindex: number;

    /**
     * Current value of the select.
     */
    currentValue = null;

    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Initialise component.
     */
    ngOnInit() {
        // set initial value
        this.currentValue = this.form.get(this.field);

        // update value if form value changes programmatically
        this.form.get(this.field).statusChanges.subscribe(() => {
            this.currentValue = this.form.get(this.field).value;
        });
    }

    /**
     * Change form field value on select change.
     * @param data
     */
    onValueChange(data: { value: string[] }) {
        // set value on form
        this.form.get(this.field).setValue(data.value);

        // mark field as touched
        this.form.get(this.field).markAsTouched();
    }
}
