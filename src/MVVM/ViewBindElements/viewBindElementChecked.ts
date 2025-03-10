import { BindWay } from "../bindWay";
import { PropertyChangeEvent } from "../propertyChangeEvent";
import { IViewBindElement, ViewBindElement } from "../viewBindElement";

export default class ViewBindElementChecked extends ViewBindElement implements IViewBindElement {

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
        super(element, propName, argList);

        if(this.bindWay != BindWay.fromViewModelToView){
           this.element.addEventListener('click', this.checkedChange.bind(this));
        }

       
    }

    setValue(value: unknown): void {
        const valueType = typeof value;
        let isChecked = false;
        if(valueType === 'boolean'){
            isChecked = value as boolean;
            
        } else if (valueType === 'string'){
            if(value as string === 'true'){
                isChecked = true;
            } 
        } else if (valueType === 'number' || valueType === 'bigint'){
            if(value as number > 0){
                isChecked = true;
            }

        }

        if(isChecked){
            (this.element as HTMLInputElement).checked = true;
        } else {
            (this.element as HTMLInputElement).checked = false;
        }
        

    }

    private checkedChange(ev: Event){
        if(this.element instanceof HTMLInputElement){       
            this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, (this.element as HTMLInputElement).checked));
        }
    }
}