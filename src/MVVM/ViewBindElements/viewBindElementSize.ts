
import {IViewBindElement, ViewBindElement} from '../viewBindElement'
import {BindWay} from '../bindWay'


//TODO - do poprawki

export default class ViewBindElementSize extends ViewBindElement implements IViewBindElement {

    protected resizeObserver?: ResizeObserver

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
        super(element, propName, argList);

        if(this.bindWay != BindWay.fromViewModelToView){
            this.resizeObserver = new ResizeObserver(this.resizeCallback.bind(this));
            this.resizeObserver.observe(this.element);
        }

    }

    protected getUnit(){
        return ('unit' in this.args) ? this.args['unit'] : 'px';
    }

    protected setHeight(height: unknown){
        const unit = this.getUnit();

        const heightType = typeof height;

        if(heightType === 'string'){
            this.element.style.height = height as string;
        } else if (heightType === 'number'){
            this.element.style.height = (height as number).toString() + unit;
        } else {
            this.element.style.removeProperty('height');
        }

    }

    protected setWidth(width: unknown){
        const unit = this.getUnit();

        const widthType = typeof width;

        if(widthType === 'string'){
            this.element.style.width = width as string;
        } else if (widthType === 'number'){
            this.element.style.width = (width as number).toString() + unit;
        } else {
            this.element.style.removeProperty('width');
        }
    }



    setValue(value: unknown): void {
        
        if(value instanceof Array){
            
            const unit: string = ('unit' in this.args) ? this.args['unit'] : 'px';

            if((value as Array<unknown>).length >= 2){

            }
        }
        
    }

    resizeCallback(resize: ResizeObserverEntry[]){
      
    }

}