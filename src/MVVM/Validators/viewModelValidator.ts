import {Validator} from "validator.ts/Validator";

export interface IViewModelValidator {
    
    /**
     * 
     * Validacja danych
     * 
     * @param value 
     */
    isValid(value:unknown): boolean;
}

export abstract class ViewModelValidator {

    protected getValueType(value: unknown){
        const type = typeof(value);
        return type;
    }

    protected convertToString(value: unknown){
        let valToCheck: string = '';
        const type = this.getValueType(value);
        switch(type){
            case 'string':
                valToCheck = (value as string);
                break;
            case 'number':
                valToCheck = (value as number).toString();
                break;
            case 'bigint':
                valToCheck = (value as bigint).toString();
                break;
        }

        return valToCheck;
    }

}

export class ViewModelValidatorNoEmpty  extends ViewModelValidator implements IViewModelValidator{

    isValid(value: unknown): boolean {
        
        const validator = new Validator();
        
        let valToCheck = this.convertToString(value);
        return validator.isLength(valToCheck, 1);

    }

}