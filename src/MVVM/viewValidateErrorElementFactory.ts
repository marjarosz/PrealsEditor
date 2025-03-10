
import { IValidateErrorChangeEventTarget, ValidateErrorChangeEventTarget } from "./validateErrorChangeEventTarget";
import { IViewValidateErrorElement } from "./viewValidateErrorElement";
import { ViewValidateErrorElementClass } from "./ViewValidateErrorElements/viewValidateErrorElementClass";

export class ViewValidateErrorElementFactory {
    
    private static errorElemntsList :{[name: string] : (element: HTMLElement, name: string, argList: string[], eventTarget:IValidateErrorChangeEventTarget)=>IViewValidateErrorElement } = {

        click: (element, name, argList, eventTarget) =>{return new ViewValidateErrorElementClass(element, name, argList, eventTarget)},
    }

    static getErrorElement(type: string, element: HTMLElement, name:string, argList: string[], eventTarget?:IValidateErrorChangeEventTarget){

        const evTarget = (eventTarget) ? eventTarget : new ValidateErrorChangeEventTarget();

        if(type in this.errorElemntsList){
            return this.errorElemntsList[type](element, name, argList, evTarget);
        }

        return new ViewValidateErrorElementClass(element, name, argList, evTarget);

    }

}