import { PropertyChangeEvent } from '../propertyChangeEvent';
import {IViewBindElement, ViewBindElement} from '../viewBindElement'


export default class ViewBindElementValue extends ViewBindElement implements IViewBindElement {
    

    private _chnageEventBind = this.observeCallback.bind(this);

    constructor(element: HTMLElement, name:string, argList: string[]){
        super(element, name, argList);
        this.setObserve();
    }

    setValue(value: unknown){
      
        
        if(this.element instanceof HTMLInputElement){
            this.element.value = this.prepareValue(value).toString();
        } else {
            this.element.innerText = this.prepareValue(value).toString();
        }
      
        
    }

    private setObserve(){
        if('triggerType' in this.args){

            if(this.args['triggerType'] === 'input'){
                this.element.addEventListener('input', this._chnageEventBind);
                
                return;
            } 

        } 

        this.element.addEventListener('change', this._chnageEventBind);
       
    }

    private observeCallback(event : Event){
        const val = (this.element as HTMLInputElement).value;
        this.dispatchEvent(val);
    }
}