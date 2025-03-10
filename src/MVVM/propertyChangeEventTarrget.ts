import {PropertyChangeEvent} from './propertyChangeEvent'

export interface IPropertyChangeEventTarrget extends EventTarget {
   
    propertyChange<T>(propertyName: string, value:T):void;
}


export class PropertyChangeEventTarrget extends EventTarget implements IPropertyChangeEventTarrget
{
    //private propertyChangeEvent = new PropertyChangeEvent('property-change');

    public propertyChange<T>(propertyName: string, value:T){

        // this.propertyChangeEvent.propertyName = propertyName;
        // this.propertyChangeEvent.value = value;
        this.dispatchEvent(new PropertyChangeEvent('property-change', propertyName, value) );
    }

}