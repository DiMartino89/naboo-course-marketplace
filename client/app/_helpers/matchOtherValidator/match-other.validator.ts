import {FormControl} from '@angular/forms';

export function MatchOtherValidator(otherControlName: string) {

    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {
        if (!control.parent) {
            return null;
        }

        // Initializing the validator.
        if (!thisControl) {
            thisControl = control;
            otherControl = control.parent.get(otherControlName) as FormControl;

            if (!otherControl) {
                throw new Error('MatchOtherValidator(): other control is not found in parent group');
            }

            otherControl.valueChanges.subscribe(() => {
                thisControl.updateValueAndValidity();
            });
        }


        if (!otherControl) {
            return null;
        }

        if (otherControl.value !== thisControl.value) {
            return {
                matchOther: true
            };
        }

        return null;
    };
}
