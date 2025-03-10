import { ICommandActionEventTarget } from "../commandActionEventTarget";
import { IViewCommandElement, ViewCommandElement } from "../viewCommandElement";


export default class ViewCommandElementFocusout extends ViewCommandElement implements IViewCommandElement {

    constructor(element: HTMLElement, commandName: string, argList: string[], eventTarget: ICommandActionEventTarget){
        super(element, commandName, argList, eventTarget);

        this.element.addEventListener('focusout', this.inputElement.bind(this));
    }

    private inputElement(event: Event){
        event.stopImmediatePropagation();

        this.eventTarget.commandAction(this.commandName, event.target as HTMLElement );

    }
}