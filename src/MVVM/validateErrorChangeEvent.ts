export interface IValidateErrorChange extends Event{
    propertyName: string;
    isValid: boolean;
}

export class ValidateErrorChange extends Event implements IValidateErrorChange{
    constructor(type: string, public readonly propertyName: string, public readonly isValid: boolean){
        super(type);
    }
}