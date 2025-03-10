import { IViewModelValidator, ViewModelValidator } from "./viewModelValidator";
import {Validator} from "validator.ts/Validator";
import { IsEmailOptions } from "validator.ts/ValidationOptions";

export class ViewModelValidatorEmail extends ViewModelValidator implements IViewModelValidator {

    isValid(value: unknown): boolean {
        let isValid = false;
        const type = this.getValueType(value);

        if(type != 'string'){
            return isValid;
        }

        const validator = new Validator();
        const options: IsEmailOptions = {
           
        }
        isValid = validator.isEmail(value as string, options);
        
        return isValid;
    }

}