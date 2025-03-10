import { Validator } from "validator.ts/Validator";
import { IViewModelValidator, ViewModelValidator } from "./viewModelValidator";


export class ViewModelValidatorInteger extends ViewModelValidator implements IViewModelValidator {

    isValid(value: unknown): boolean {
        let isValid = false;
        let type = this.getValueType(value);
   
        const validator = new Validator();
        if(type === 'string') {
           return validator.isInt(value as string, {min: 1});
        } 

        if(type != 'number') {
            return validator.isInt(value as number, {min: 1});
        }
    
        return isValid;
    }

}