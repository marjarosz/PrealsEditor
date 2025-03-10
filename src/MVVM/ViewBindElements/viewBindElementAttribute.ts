import {IViewBindElement, ViewBindElement} from '../viewBindElement'
import {BindWay} from '../bindWay'
import {PropertyChangeEvent} from '../propertyChangeEvent'


export default class ViewBindElementAttribute extends ViewBindElement implements IViewBindElement
{


    protected mutationObserver?: MutationObserver

    constructor(protected element: HTMLElement, protected propName: string, argList: string[]){
        super(element, propName, argList);

        if(this.bindWay != BindWay.fromViewModelToView){
           
            this.mutationObserver = new MutationObserver(this.mutationCallback.bind(this));

            if('attrName' in this.args){
                
                this.mutationObserver.observe(this.element, {
                    attributeFilter: [ this.args['attrName'] ],
                    attributeOldValue: true,
                    attributes: true,
                    subtree: true
                  })
            }
        }

       
    }

    setValue(value: unknown): void {
        const valueType = typeof value;
        if('attrName' in this.args){
            const attrName = this.args['attrName'];
            

            let nVal = value;

            if(valueType === 'string'){

                if(attrName === 'src') {
                    const isData = (value as string).slice(0, 4);
                    
                    if(isData != 'data'){
                        nVal = window.location.origin + "/" + value;
                    }
                }

                

                this.element.setAttribute(attrName, nVal as string);
            } else if (valueType === 'boolean'){
                if(value){
                    this.element.setAttribute(attrName, attrName);
                } else {
                    this.element.removeAttribute(attrName);
                }
                // this.element.setAttribute(attrName, value as boolean);
                // this.element[attrName] = value;
            } else if(valueType === 'number'){
                this.element.setAttribute(attrName, (value as number).toString());
            }

            
        }
    }

    mutationCallback(mutation: MutationRecord[]){
        
        const newValue = this.element.getAttribute(this.args['attrName']);
        this.propertyChange.dispatchEvent(new PropertyChangeEvent('property-change', this.propName, newValue));
        
    }
}