import {IViewBindElement, ViewBindElement} from '../viewBindElement'

export default class ViewBindElementDisplay extends ViewBindElement implements IViewBindElement{
    
    setValue(value: unknown): void {
            
        const valueType = typeof value;

        if(valueType === 'boolean'){

            //Value jest boolean

            const trueVal = ('trueVal' in this.args) ? this.args['trueVal'] : 'block';
            const falseVal = ('falseVal' in this.args) ? this.args['falseVal'] : 'none';

            this.element.style.display = (value) ? trueVal : falseVal;

        } else if(valueType === 'string'){

            //value jest string
            
            this.element.style.display = value as string;
        }

    }
}