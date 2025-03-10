import { IViewCommandElement, ViewCommandElement } from "../viewCommandElement";
import {ICommandActionEventTarget} from '../commandActionEventTarget'

export default class ViewCommandElementMouseInOut extends ViewCommandElement implements IViewCommandElement {
    
    constructor(element: HTMLElement, commandName: string, argList: string[], eventTarget: ICommandActionEventTarget){
        super(element, commandName, argList, eventTarget);

        const triger = ('triger' in this.args) ? this.args['triger'] : 'both'; //mouseIn, mouseOut

        if(triger === 'mouseIn' || triger === 'both'){
            this.element.addEventListener('mouseenter', this.mouseenterEvent.bind(this));
        }
        
        if(triger === 'mouseOut' || triger === 'both'){
            this.element.addEventListener('mouseleave', this.mouseleaveEvent.bind(this));
        }

        
        
    }

    private mouseenterEvent(event: Event){
        event.stopImmediatePropagation();
        
        this.eventTarget.commandAction(this.commandName, this, 'mouseIn');
    }


    private mouseleaveEvent(event: Event){
        event.stopImmediatePropagation();
        
        this.eventTarget.commandAction(this.commandName, this, 'mouseOut');
    }

}