
import {IViewBindElement, ViewBindElement} from '../viewBindElement'


export default class ViewBindElementInnerText extends ViewBindElement implements IViewBindElement {
     
    setValue(value: unknown){

        const val = this.prepareValue(value);
        this.element.innerText = val.toString();
    }
}