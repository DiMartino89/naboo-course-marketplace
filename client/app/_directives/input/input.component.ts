import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare var $: any;

@Component({
	moduleId: module.id,
    selector: 'app-input',
    templateUrl: 'input.component.html'
})

export class InputComponent implements OnInit, AfterViewInit {
    @Input() type: string;
    @Input() label: any;
	@Input() labelHidden: boolean;
	@Input() inputHidden: boolean;
    @Input() id: string;
    @Input() placeholder: string;
    @Input() form: FormGroup;
    @Input() field: string;
    @Input() errorText: string;
    @Input() tabindex: number;
    @Input() showForgotPasswordLink = false;
    @Input() renderTOSText = false;
    @Input() name = '';
    @Input() multipleInputs = false;
    @Input() stacked = false;
    @Input() legend: string;
    @Input() value: any;
    @Input() horizontal = false;
    @Input() multiple: boolean;

    constructor() {
    }

    ngOnInit() {
        if (!this.name || this.name === '') {
            this.name = this.field;
        }

        if (this.isCustomType()) {
            // update form field manually because angular sucks!
            $(document).on('change', '[name="' + this.name + '"]', (evt) => {
                if (this.multipleInputs) {
                    const val = $('[name="' + this.name + '"]').map((i, el) => {
                        return $(el).prop('checked') ? this.value[i] : false;
                    }).get();
                    this.form.get(this.field).setValue(val);
                } else {
                    this.form.get(this.field).patchValue($(evt.currentTarget).prop('checked'));
                }
            });
        }

        if (this.isFileType()) {
            // update form field manually because angular sucks!
            $(document).on('change', '[name="' + this.name + '"]', (evt) => {
                this.form.get(this.field).setValue($(evt.currentTarget).get(0).files);
            });
        }
    }

    ngAfterViewInit(): void {
        // init form field manually because angular sucks!
        // also set a listener in case something changes the value later
        if (this.isCustomType() && !this.multipleInputs) {
            this.updateCheckbox();

            this.form.get(this.field).statusChanges.subscribe(() => {
                this.updateCheckbox();
            });
        } else if (this.isCustomType() && this.multipleInputs) {
            this.updateCheckboxes();

            this.form.get(this.field).statusChanges.subscribe(() => {
                this.updateCheckboxes();
            });
        }
    }

    updateCheckbox() {
        $('[name="' + this.name + '"]').prop('checked', this.form.get(this.field).value);
    }

    updateCheckboxes() {
        this.form.get(this.field).value.forEach((val) => {
            $('[value="' + val + '"]').prop('checked', true);
        });
    }

    isRegularType() {
        return !this.isCustomType() && !this.isTextareaType() && !this.isFileType() && !this.isSelectType();
    }

    isFileType() {
        return this.type === 'file';
    }

    isTextareaType() {
        return this.type === 'textarea';
    }

    isSelectType() {
        return this.type === 'select';
    }

    isHiddenType() {
        return this.type === 'hidden';
    }

    isCustomType() {
        return this.type === 'checkbox' || this.type === 'radio';
    }
}
