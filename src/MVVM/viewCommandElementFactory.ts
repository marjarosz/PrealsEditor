import {IViewCommandElement} from './viewCommandElement'
import {ICommandActionEventTarget, CommandActionEventTarget} from './commandActionEventTarget'

import ViewCommandElementClick from './ViewCommandElements/viewCommandElementClick'
import ViewCommandElementMouseInOut from './ViewCommandElements/viewCommandElementMouseInOut';
import ViewCommandElementChange from './ViewCommandElements/viewCommandElmeentChange';
import ViewCommandElementInput from './ViewCommandElements/viewCommandElementInput';
import ViewCommandElementFocusout from './ViewCommandElements/viewCommandElementFocusout';

export class ViewCommandElementFactory {


    private static viewCommandList :{[comamndName: string] : (element: HTMLElement, name: string, argList: string[], eventTarget:ICommandActionEventTarget)=>IViewCommandElement } = {
        click: (element, name, argList, eventTarget) =>{return new ViewCommandElementClick(element, name, argList, eventTarget)},
        mouseInOut: (element, name, argList, eventTarget) =>{return new ViewCommandElementMouseInOut(element, name, argList, eventTarget)},
        change: (element, name, argList, eventTarget) =>{return new ViewCommandElementChange(element, name, argList, eventTarget)},
        input: (element, name, argList, eventTarget) =>{return new ViewCommandElementInput(element, name, argList, eventTarget)},
        focusout: (element, name, argList, eventTarget) =>{return new ViewCommandElementFocusout(element, name, argList, eventTarget)}
    };


    static getCommandElement(type: string, element: HTMLElement, name:string, argList: string[], eventTarget?:ICommandActionEventTarget): IViewCommandElement{

        const evTarget = (eventTarget) ? eventTarget : new CommandActionEventTarget();

        if(type in this.viewCommandList){
            return this.viewCommandList[type](element, name, argList, evTarget);
        }

        return new ViewCommandElementClick(element, name, argList, evTarget);
    }
}