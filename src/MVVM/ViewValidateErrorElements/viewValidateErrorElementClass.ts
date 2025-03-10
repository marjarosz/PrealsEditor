import { IValidateErrorChangeEventTarget } from "../validateErrorChangeEventTarget";
import { IViewValidateErrorElement, ViewValidateErrorElement } from "../viewValidateErrorElement";

export class ViewValidateErrorElementClass extends ViewValidateErrorElement implements IViewValidateErrorElement {
    

    
    constructor(element: HTMLElement, propName: string, argList: string[], eventTarget: IValidateErrorChangeEventTarget){
        super(element, propName, argList, eventTarget);

        

        if('focusOut' in this.argsList && this.argsList['focusOut'] === 'true'){
            this.element.addEventListener('blur', this.focusOut.bind(this));
            
        }

        if('focusIn' in this.argsList && this.argsList['focusIn'] === 'true'){
            this.element.addEventListener('focus', this.focusIn.bind(this));
            
        }

    }

    setValid(isValid: boolean): void {
        super.setValid(isValid);
        this.setClass(isValid);
    }

    private setClass(isValid: boolean){
        if(isValid){
            this.removeErrorClass();
            this.addNoErrorClass();

        } else {
            this.removeNoErrorClass();
            this.addErrorClass();
 
        }
    }

    private focusOut(event: Event){
        
        if(this.isValid){
            this.removeNoErrorClass();
        }
    }

    private focusIn(event: Event){
        
        this.setClass(this.isValid);
    }

    private addErrorClass(){
       if(('errorClass' in this.argsList)){
           this.element.classList.add(this.argsList['errorClass']);
       }
         
    }

    private removeErrorClass(){
        if(('errorClass' in this.argsList)){
            this.element.classList.remove(this.argsList['errorClass']);
        }
    }

    private addNoErrorClass(){
        if(('noErrorClass' in this.argsList)) {
            this.element.classList.add(this.argsList['noErrorClass']);
        }
    }

    private removeNoErrorClass(){
        if(('noErrorClass' in this.argsList)) {
            this.element.classList.remove(this.argsList['noErrorClass']);
        }
    }
}