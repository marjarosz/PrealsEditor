import { IViewModelValidator, ViewModelValidator } from "./viewModelValidator";

export class ViewModelValidatorTrue extends ViewModelValidator implements IViewModelValidator {

    isValid(value: unknown): boolean {
        let isValid = false;

        const type = this.getValueType(value);
        if(type === 'boolean'){
            isValid = value as boolean;
        } else if (type === 'string'){
            if(value as string === 'true'){
                isValid = true;
            }
        } else if (type === 'number' || type === 'bigint'){
            if(value as number > 0){
                isValid = true;
            }
        }

        return isValid;
    }

}