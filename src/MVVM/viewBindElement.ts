import {BindWay} from './bindWay'
import { PropertyChangeEvent } from './propertyChangeEvent';
import {IPropertyChangeEventTarrget, PropertyChangeEventTarrget} from './propertyChangeEventTarrget'

export interface IViewBindElement{

    readonly bindWay: BindWay;

    /**
     * Ustawia wartosc dla bind
     * 
     * @param value wartosc do bindowania
     */
    setValue(value: unknown):void;

    /**
     * Subskrybcaj zmian
     * 
     * @param propertyChangeEvent - callback zmiany
     */
    subscribe(propertyChangeEvent: (event: Event)=>void): void;

    //TODO - POPRAWIC

    /**
     * Anulowanie subskrybcji zmian
     * 
     * @param propertyChangeEvent 
     */
    unsunscribe(propertyChangeEvent: (event: Event)=>void): void
}

export abstract class ViewBindElement {


    public valueChangeCallback: (value: any)=>void = (value: any)=>{};

    protected args: {[argName: string]: string} = {};

    public readonly bindWay: BindWay;

    protected propertyChange: IPropertyChangeEventTarrget = new PropertyChangeEventTarrget();

    protected onPropertyChangeEvent= (event: Event)=>{};

    

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
     
        let bindWay = '';
        for (const arg of argList){
            const argArray = arg.split(':');
            if(argArray.length >=2){

                const argsName = argArray[0].trim();

                if(argsName != 'bindWay'){
                    this.args[argsName] = argArray[1].trim();
                } else {
                   bindWay =  argArray[1].trim();
                }
              
            }
        }

        this.bindWay = this.getBindWayAttr(bindWay.trim());

    }

    protected prepareValue(value: any){
       const valType = typeof value;

       let retValue: string | number = '';

       if(valType != "undefined"){
           if(valType === 'number'){
                retValue = value;
           } else {
                retValue = value.toString();
           }
       }

       return retValue;
    }



    protected dispatchEvent(value: unknown){
        
        this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, value));       
    }

    private getBindWayAttr(attr: string){

        let bindWay;
        
        switch(attr){
            case 'v-mv': 
                bindWay = BindWay.fromViewToViewModel;
                break;
            case 'mv-v':
                bindWay = BindWay.fromViewModelToView;
                break;
            case 'both':
                bindWay = BindWay.both;
                break;
            default:
                bindWay = BindWay.fromViewModelToView
        }

        return bindWay;
    }   

    public subscribe(propertyChangeEvent: (event: Event)=>void){
        
        this.onPropertyChangeEvent = propertyChangeEvent;
        this.propertyChange.addEventListener('property-change', this.onPropertyChangeEvent);
    }

    public unsunscribe(propertyChangeEvent: (event: Event)=>void){
        this.propertyChange.removeEventListener('property-change', this.onPropertyChangeEvent);
    }

    

}



