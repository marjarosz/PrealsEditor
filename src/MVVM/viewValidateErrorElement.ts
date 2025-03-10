import { IValidateErrorChangeEventTarget } from "./validateErrorChangeEventTarget";

export interface IViewValidateErrorElement {

    subscribe(functionEvent: (event: Event)=>void):void;
    unsubscribe():void;
    setValid(isValid: boolean):void

}

export abstract class ViewValidateErrorElement implements IViewValidateErrorElement{

    protected onValidateErrorChange = (event: Event)=>{};

    protected isValid: boolean = false;

    protected argsList: {[argName: string]: string} = {};

    constructor(protected element: HTMLElement, protected propName: string, argList: string[], protected eventTarget: IValidateErrorChangeEventTarget){
        this.prepareArgs(argList)
    }

    subscribe(functionEvent: (event: Event)=>void):void {
        this.onValidateErrorChange = functionEvent;
        this.eventTarget.addEventListener('error-change', this.onValidateErrorChange)
    }

    unsubscribe():void {
        this.eventTarget.removeEventListener('error-change', this.onValidateErrorChange)
    }

    setValid(isValid: boolean): void {
        this.isValid = isValid;
    }

    protected prepareArgs(argList: string[]){
        for(const arg of argList){
            const argArray = arg.split(":");
            if(argArray.length == 2){
                this.argsList[argArray[0].trim()] = argArray[1].trim();
            }
        }
    }
}