// password-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordMismatchError {
  passwordMismatch: boolean;
}

export function passwordMatchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (
      matchingControl.errors &&
      !('passwordMismatch' in matchingControl.errors)
    ) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      const error: PasswordMismatchError = { passwordMismatch: true };
      matchingControl.setErrors({ ...matchingControl.errors, ...error });
      return error;
    } else {
      if (matchingControl.errors) {
        const { passwordMismatch, ...otherErrors } = matchingControl.errors;
        matchingControl.setErrors(
          Object.keys(otherErrors).length ? otherErrors : null
        );
      }
      return null;
    }
  };
}
