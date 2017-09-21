import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChildren} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-radios',
    templateUrl: './radios.component.html'
})
export class RadiosComponent implements OnInit, AfterViewInit {
    /**
     * Checkbox inputs.
     */
    @ViewChildren('radio') radios;

    /**
     * Reactive form the radios are connected to.
     */
    @Input() form: FormGroup;

    /**
     * Field inside the form the radios correspond to.
     */
    @Input() field: string;

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
     * Values of individual inputs.
     */
    @Input() values: string[];

    /**
     * Labels of individual input.
     */
    @Input() labels: string[];

    /**
     * Whether the radios should be stacked or not.
     */
    @Input() stacked = false;

    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Initialise component.
     */
    ngOnInit() {
    }

    /**
     * Setup things after view has been initialised.
     */
    ngAfterViewInit() {
        // update form on radio update
        this.radios.forEach((checkbox: ElementRef) => {
            checkbox.nativeElement.addEventListener('change', this.onRadioChange.bind(this));
        });

        // update radios on form update
        this.form.get(this.field).valueChanges.subscribe(this.onFormChange.bind(this));

        // read default values
        this.onFormChange();
    }

    /**
     * Update form value on radio change.
     */
    onRadioChange() {
        const status = this.radios.map((radio) => {
            return radio.nativeElement.checked ? radio.nativeElement.value : null;
        }).filter(i => i);

        this.form.get(this.field).setValue(status.length === 1 ? status[0] : null);
        this.form.get(this.field).markAsTouched();
    }

    /**
     * Update radio values on form change
     */
    onFormChange() {
        const status = this.form.get(this.field).value;

        this.radios.forEach((radio: ElementRef) => {
            radio.nativeElement.checked = status === radio.nativeElement.value;
        });
    }
}
