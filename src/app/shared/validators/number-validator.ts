import { AbstractControl } from '@angular/forms';

export function isNumberValidator (control: AbstractControl) {
    if (Number.isNaN(+control.value) || +control.value <= 0) {
      return { notAPrice: true };
    }
    return null;
}
