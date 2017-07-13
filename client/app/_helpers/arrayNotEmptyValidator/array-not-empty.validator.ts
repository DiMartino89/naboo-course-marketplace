import { FormControl } from '@angular/forms';

export function ArrayNotEmptyValidator() {
    return function arrayNotEmptyValidate(control: FormControl) {
        for (let i = 0; i < control.value.length; i++) {
            if (control.value[i] !== false) {
                return null;
            }
        }

        return {
            arrayNotEmpty: true
        };
    };
}
