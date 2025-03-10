import { IViewCommandElement, ViewCommandElement } from "../viewCommandElement";
import {ICommandActionEventTarget} from '../commandActionEventTarget'


export default class ViewCommandElementClick extends ViewCommandElement implements IViewCommandElement {


    constructor(element: HTMLElement, commandName: string, argList: string[], eventTarget: ICommandActionEventTarget){
        super(element, commandName, argList, eventTarget);

        this.element.addEventListener('click', this.clickElement.bind(this));
    }

    private clickElement(event: Event){
        event.stopImmediatePropagation();

        this.eventTarget.commandAction(this.commandName, event.target as HTMLElement );

    }

}