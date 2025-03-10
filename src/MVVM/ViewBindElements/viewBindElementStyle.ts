import {IViewBindElement, ViewBindElement} from '../viewBindElement'

export default class ViewBindElementStyle extends ViewBindElement implements IViewBindElement {

    setValue(value: unknown): void {
        
        const valueType = typeof value;

        if(valueType === 'number'){
            this.setStyleValue((value as number).toString())
        } else if(valueType === 'string') {
            this.setStyleValue(value as string);
        }
        
    }

    private setStyleValue(value: string){
        if('styleName' in this.args){
            this.element.style.setProperty(this.args['styleName'], value as string);
        } else {
            this.element.setAttribute('style', value as string);
        }
    }

}