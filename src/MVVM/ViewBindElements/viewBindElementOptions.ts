
import { HtmlUtility } from "../../Utility/htmlUtility";
import { PropertyChangeEvent } from "../propertyChangeEvent";
import { IViewBindElement, ViewBindElement } from "../viewBindElement";

export interface IOptionValue {
    value: string;
    label: string;
    isSelected: boolean;
}

export class OptionValue implements IOptionValue {
    constructor(public value: string, public label: string, public isSelected: boolean){

    }
}

export default class ViewBindElementOptions extends ViewBindElement implements IViewBindElement {

    protected optionValues: IOptionValue[] = [];

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
        super(element, propName, argList);
        
        this.element.addEventListener('change', this.change.bind(this));
    }

    setValue(value: unknown): void {
        
        if(value instanceof Array){
            if((value as Array<IOptionValue>).length > 0){
                if( (value as Array<IOptionValue>)[0] instanceof OptionValue){
                    this.optionValues = value as Array<IOptionValue>;
                    this.setOptions();
                }
            }
        }
    }

    private setOptions(){

        HtmlUtility.clearElement(this.element);
        let selVal: string | undefined;

        for(const opt of this.optionValues){
            const op = HtmlUtility.createHtmlElement('option', null, null);
            op.innerText = opt.label;
            (op as HTMLOptionElement).value = opt.value;

            if(opt.isSelected){
                selVal = opt.value;
            }
            this.element.append(op);

        }

        if(selVal){
            (this.element as HTMLInputElement).value = selVal;
        }
    } 
    
    private change(event: Event){
        
        const curSel = this.optionValues.filter(x=>x.isSelected == true);
        for(const cs of curSel){
            cs.isSelected = false;
        }

        const newSel = this.optionValues.find(x=>x.value === (this.element as HTMLInputElement).value);
        if(newSel){
            newSel.isSelected = true;
            this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, this.optionValues));
            
        }

        
    }

}