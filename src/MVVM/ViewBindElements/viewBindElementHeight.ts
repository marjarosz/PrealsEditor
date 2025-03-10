import ViewBindElementSize from './viewBindElementSize'
import {PropertyChangeEvent} from '../propertyChangeEvent'

export default class ViewBindElementHeight extends ViewBindElementSize {

    setValue(value: unknown): void {
        this.setHeight(value);
    }

    resizeCallback(resize: ResizeObserverEntry[]): void {

        if(resize.length > 0){
            this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, resize[0].contentRect.height));
        }

       
    }

}