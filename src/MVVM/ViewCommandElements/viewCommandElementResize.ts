import { IViewCommandElement, ViewCommandElement } from "../viewCommandElement";
import {ICommandActionEventTarget} from '../commandActionEventTarget'

export default class ViewCommandElementResize extends ViewCommandElement implements IViewCommandElement {

    constructor(element: HTMLElement, commandName: string, argList: string[], eventTarget: ICommandActionEventTarget){
        super(element, commandName, argList, eventTarget);

        window.addEventListener('resize', this.resizeElement.bind(this));
       
    }

    private resizeElement(event: Event){
       
        const params: string[] = [];
        event.stopImmediatePropagation();
        this.eventTarget.commandAction(this.commandName, this.element as HTMLElement );

    }
}