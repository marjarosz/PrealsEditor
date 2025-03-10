export interface IPropertyChangeEvent extends Event{
    propertyName: string;
    value: unknown;
}

export class PropertyChangeEvent extends Event implements IPropertyChangeEvent{
    
    constructor(type: string, public readonly propertyName: string, public readonly value: unknown){
        super(type);
    }

}