import {IViewBindElement, ViewBindElement} from '../viewBindElement'

export default class ViewBindElementVisibility extends ViewBindElement implements IViewBindElement{

    setValue(value: unknown): void {

        this.element.style.visibility = (value) ? 'visible' : 'hidden';
    }
}