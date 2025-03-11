
import { ICommand } from './command';
import {IPropertyChangeEventTarrget, PropertyChangeEventTarrget} from './propertyChangeEventTarrget'
import {Validator} from "validator.ts/Validator";
import { IViewModelValidator } from './Validators/viewModelValidator';
import { IValidateErrorChangeEventTarget, ValidateErrorChangeEventTarget } from './validateErrorChangeEventTarget';

export interface IViewModelView {
    //Dostepne tylko z view
    getPropertyValue(name: string): unknown
    setPropertyValue(name: string, value: unknown, callbackExecute?: boolean): void
    subscribeProperties(eventCallback: (event: Event)=>void): void;
    unsubscribeProperties(eventCallback: (event: Event)=>void): void
    subscribeValidateError(eventCallback: (event: Event)=>void): void;
    unsubscribeValidateError(eventCallback: (event: Event)=>void): void;
    getCommand(name: string): ICommand | undefined;
    validateProperty(name: string): void;
    dispose():void;
}

export interface IViewModel extends IViewModelView{   
    //Dostepne tylko z ViewModel
    isPropertyChange(propName: string, value: unknown): void;   
    isValidateErrorChange(propName: string, isValid: boolean): void;
    setPropertyValueChange(name: string, value: unknown): void
    registerProperty(name: string, value?: unknown, changeCallback?: (value: unknown)=>void): void
    unregisterProperty(name: string):void
    hasRegistredProperty(name: string): boolean;
    registerCommand(name: string, command: ICommand): void
    unregisterCommand(name: string): void
    registerProperties(properties: {[propertyName: string]: unknown}): void
    hasPropertyValidator(name: string): boolean;
    registerPropertyValidator(name: string, validators: IViewModelValidator[]): void
    unregisterPropertyValidator(name: string):void;
    validateProperty(name: string): void
    dispose():void;
}


/**
 * Property dla ViewModel
 */
type ViewModelProperty = {
    value: unknown
    changeCallback?: (value: unknown, propertyKey: string)=>void 
}


interface ViewModelProprtyValidate {

    validators: Set<IViewModelValidator>
}

export class ViewModel implements IViewModel, IViewModelView{


    /**
     * Event PropertyChange
     */
    protected propertyChange: IPropertyChangeEventTarrget = new PropertyChangeEventTarrget();

    /**
     * Event Validate Error Change
     */
    protected errorValidateChange: IValidateErrorChangeEventTarget = new ValidateErrorChangeEventTarget();

    /**
     *  Lista wlascisowsci ViewModel
     */
    protected properties: { [prop: string] : ViewModelProperty} = {};


    /**
     * Lista commands
     */
    protected commands: {[command: string] : ICommand} = {}

    /**
     * Lista validacji
     */
    protected validators: {[prop: string] : ViewModelProprtyValidate} = {};

    /**
     * 
     * Wywoluje property change z przekazana wartoscia
     * 
     * @param propName 
     * @param value 
     */
    public isPropertyChange(propName: string, value: unknown){
        this.propertyChange.propertyChange(propName, value);
    }

    public isValidateErrorChange(propName: string, isValid: boolean){
        this.errorValidateChange.validateErrorChange(propName, isValid);
    }

    /**
     * 
     * Ustawia property, nie wywoluje property change
     * 
     * @param name 
     * @param value 
     * @returns true jak istnieje property, false jak nie
     */
    public setPropertyValue(name: string, value: unknown, callbackExecute: boolean = true){
        if(name in this.properties){

            const prop = this.properties[name];
           
            prop.value = value;
            if(prop.changeCallback && callbackExecute){
                prop.changeCallback(prop.value, name);
            }

            /**
             * Validacja
             */
            if(this.hasPropertyValidator(name)){
                this.validateProperty(name);
            }

            return true;
        }
        return false;
    }

    /**
     * 
     * Ustawia wartosc property, wywoluje poperty change
     * 
     * @param name 
     * @param value 
     */
    public setPropertyValueChange(name: string, value: unknown, callbackExecute: boolean = false){
        if(this.setPropertyValue(name, value,callbackExecute)){
            this.isPropertyChange(name, value);
        }
    }

    /**
     * 
     * Zwraca wartosc propery jezeli istnieje
     * 
     * @param name 
     * @returns 
     */
    public getPropertyValue(name: string){
        
        return (name in this.properties) ? this.properties[name].value : undefined;
    }

    /**
     * 
     * Dodaj subskrybcje properties 
     * 
     * @param eventCallback 
     */
    public subscribeProperties(eventCallback: (event: Event)=>void){
        this.propertyChange.addEventListener('property-change', eventCallback)
    }


    /**
     * 
     * Usun subskrypcje properties
     * 
     * @param eventCallback 
     */
    public unsubscribeProperties(eventCallback: (event: Event)=>void){
        this.propertyChange.removeEventListener('property-change', eventCallback);
    }


    public subscribeValidateError(eventCallback: (event: Event)=>void){
        this.errorValidateChange.addEventListener('error-change', eventCallback);
    }

    public unsubscribeValidateError(eventCallback: (event: Event)=>void){
        this.errorValidateChange.removeEventListener('error-change', eventCallback);
    }

    getCommand(name: string): ICommand | undefined{
        return this.commands[name];
    }

    /**
     * 
     * Rejestruje property 
     * 
     * @param name 
     * @param value 
     */
    public registerProperty(name: string, value?: unknown, changeCallback?: (value: unknown)=>void){
        this.properties[name] = {value: value, changeCallback: changeCallback};
    }

    public hasRegistredProperty(name: string){
        return name in this.properties;
    }

    public registerProperties(properties: {[propertyName: string]: unknown}){
        for(const propName in properties){
            this.registerProperty(propName, properties[propName]);
        }
    }

    /**
     * 
     * Usuwa property z obserowanych
     * 
     * @param name 
     */
    public unregisterProperty(name: string){
        delete this.properties[name];
    }

    public registerCommand(name: string, command: ICommand){
        this.commands[name] = command;
    }

    public unregisterCommand(name: string){
        delete this.commands[name];
    }

    public hasPropertyValidator(name: string){
        return name in this.validators;
    }

  

    public registerPropertyValidator(name: string, validators: IViewModelValidator[]){
        if(this.hasPropertyValidator(name)){
           
            for(const validator of validators){
                this.validators[name].validators.add(validator);
            }

        } else {
            const vals = new Set<IViewModelValidator>();

            for(const validator of validators){
                vals.add(validator);
            }
            this.validators[name] = {
                validators: vals
            }
        }
    }

    public unregisterPropertyValidator(name: string){
        delete this.validators[name];
    }

    public validateProperty(name: string){
        if(this.hasPropertyValidator(name)){
            let isValid = this.validProp(name);
            this.isValidateErrorChange(name, isValid);
        }
       
    }

    private validProp(name: string){
        let isValid = false;
        for(const val of this.validators[name].validators){
            isValid = val.isValid(this.getPropertyValue(name));
            if(!isValid){
                break;
            }
        }
        return isValid;
        
    }

    public validate(){
        let isValid = true;
        for(const propName in this.validators){
            const currentVal = this.validProp(propName);
            if(!currentVal){
                isValid = currentVal;
                this.isValidateErrorChange(propName, currentVal);
            }
        
        }
        return isValid;
    }

    public dispose() {

    }


}



