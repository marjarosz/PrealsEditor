import { IViewModelValidator, ViewModelValidator } from "./viewModelValidator";
import {Validator} from "validator.ts/Validator";

export class ViewModelValidatorLength extends ViewModelValidator implements IViewModelValidator {

    constructor(protected minLength: number, protected maxLength?: number){
        super();
    }

    isValid(value: unknown): boolean {
        let isValid = false;
        const type = this.getValueType(value);
        const validator = new Validator();

        if(type === 'string'){
            isValid = validator.isLength(value as string, this.minLength, this.maxLength);
        } else if(type === 'number'){
            isValid = validator.isLength((value as number).toString(), this.minLength, this.maxLength);
        } else if (type === 'bigint'){
            isValid = validator.isLength((value as bigint).toString(), this.minLength, this.maxLength);
        }

        return isValid;
    }

}