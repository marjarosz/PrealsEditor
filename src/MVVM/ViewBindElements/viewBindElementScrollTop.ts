import { BindWay } from "../bindWay";
import { PropertyChangeEvent } from "../propertyChangeEvent";
import { IViewBindElement, ViewBindElement } from "../viewBindElement";



export default class ViewBindElementScrollTop extends ViewBindElement implements IViewBindElement {

    

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
        super(element, propName, argList);

     
        if(this.bindWay != BindWay.fromViewModelToView){
            
            this.element.addEventListener('scroll', this.scrollChange.bind(this));

        }

    }


    setValue(value: unknown): void {
     
        if( typeof value === 'number'){
            this.element.scrollTop = value;

            
        }

    }

    private scrollChange(){
       
        this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, this.element.scrollTop));
    }

}