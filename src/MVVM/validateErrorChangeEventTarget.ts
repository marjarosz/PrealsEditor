import { ValidateErrorChange } from "./validateErrorChangeEvent";


export interface IValidateErrorChangeEventTarget extends EventTarget{
    validateErrorChange(propertyName: string, isValid: boolean): void;
}

export class ValidateErrorChangeEventTarget extends EventTarget implements IValidateErrorChangeEventTarget {

    validateErrorChange(propertyName: string, isValid: boolean): void {
        this.dispatchEvent(new ValidateErrorChange('error-change', propertyName, isValid));
    }

}