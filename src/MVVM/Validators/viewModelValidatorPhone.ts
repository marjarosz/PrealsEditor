import { Validator } from "validator.ts/Validator";
import { IViewModelValidator, ViewModelValidator } from "./viewModelValidator";

export class ViewModelValidatorPhone extends ViewModelValidator implements IViewModelValidator {

    isValid(value: unknown): boolean {
        let isValid = false;

        const valToValid =  this.convertToString(value);

        var re: RegExp = /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{2,3}[-\s\.]?[0-9]{2,12}$/im;
        isValid = re.test(valToValid);

        return isValid;
    }

}