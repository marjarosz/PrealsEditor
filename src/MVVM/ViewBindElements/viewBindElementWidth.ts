import ViewBindElementSize from './viewBindElementSize'
import {PropertyChangeEvent} from '../propertyChangeEvent'

export default class ViewBindElementWidth extends ViewBindElementSize {

    setValue(value: unknown): void {
        this.setWidth(value);
    }

    resizeCallback(resize: ResizeObserverEntry[]): void {

        if(resize.length > 0){
            this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, resize[0].contentRect.width));
        }

       
    }

}