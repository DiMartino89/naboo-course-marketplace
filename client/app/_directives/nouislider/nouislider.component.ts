import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NouisliderComponent as NouisSlider} from 'ng2-nouislider';

@Component({
    moduleId: module.id,
    selector: 'app-nouislider',
    templateUrl: './nouislider.component.html'
})
export class NouisliderComponent implements OnInit, AfterViewInit {

    /**
     * Slider
     */
    @ViewChild('sliderRef') sliderRef: NouisSlider;

    /**
     * Reactive form the slider is connected to.
     */
    @Input() form: FormGroup;

    /**
     * Min field inside the form the min slider handle corresponds to.
     */
    @Input() minField: string;

    /**
     * Max field inside the form the max slider handle corresponds to.
     */
    @Input() maxField: string;

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
     * Minimum value of slider.
     */
    @Input() min = 0;

    /**
     * Maximum value of slider.
     */
    @Input() max = 10;

    /**
     * Step of slider.
     */
    @Input() step = 1;

    /**
     * Current value of slider.
     */
    currentValue = [0, 10];

    /**
     * Slider config.
     */
    config = {
        tooltips: [true, true],
        pips: {
            mode: 'count',
            values: 5,
            density: 8,
        }
    };

    /**
     * Constructor.
     */
    constructor() {
    }

    /**
     * Initialise component.
     */
    ngOnInit() {
        // set current values
        this.currentValue[0] = this.form.get(this.minField).value;
        this.currentValue[1] = this.form.get(this.maxField).value;

        // subscribe to min field changes
        this.form.get(this.minField).valueChanges.subscribe(() => {
            if (this.currentValue[0] !== this.form.get(this.minField).value) {
                this.currentValue[0] = this.form.get(this.minField).value;
                this.sliderRef.slider.set([this.form.get(this.minField).value, null]);
            }
        });

        // subscribe to max field changes
        this.form.get(this.maxField).valueChanges.subscribe(() => {
            if (this.currentValue[1] !== this.form.get(this.maxField).value) {
                this.currentValue[1] = this.form.get(this.maxField).value;
                this.sliderRef.slider.set([null, this.form.get(this.maxField).value]);
            }
        });
    }

    /**
     * Perform tasks after view has been initialised.
     */
    ngAfterViewInit() {
        this.sliderRef.slider.on('set', (newValue) => {
            this.form.get(this.minField).setValue(parseInt(newValue[0], 10));
            this.form.get(this.maxField).setValue(parseInt(newValue[1], 10));
        });
    }
}
