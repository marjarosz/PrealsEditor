import { IViewCommandElement, ViewCommandElement } from "../viewCommandElement";
import {ICommandActionEventTarget} from '../commandActionEventTarget'


export default class ViewCommandElementChange extends ViewCommandElement implements IViewCommandElement {


    constructor(element: HTMLElement, commandName: string, argList: string[], eventTarget: ICommandActionEventTarget){
        super(element, commandName, argList, eventTarget);

        this.element.addEventListener('change', this.changeElement.bind(this));
    }

    private changeElement(event: Event){
        event.stopImmediatePropagation();

        this.eventTarget.commandAction(this.commandName, event.target as HTMLElement );

    }

}