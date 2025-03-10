import {IViewBindElement} from './viewBindElement'

import ViewBindElementInnerHtml from './ViewBindElements/viewBindElementInnerHtml'
import ViewBindElementInnerText from './ViewBindElements/viewBindElementInnerText'
import ViewBindElementValue from './ViewBindElements/viewBindElementValue'
import ViewBindElementVisibility from './ViewBindElements/viewBindElementVisibility'
import ViewBindElementDisplay from './ViewBindElements/viewBindElementDisplay'
import ViewBindElementAttribute from './ViewBindElements/viewBindElementAttribute'
import ViewBindElementSize from './ViewBindElements/viewBindElementSize'
import ViewBindElementHeight  from './ViewBindElements/viewBindElementHeight'
import ViewBindElementWidth from './ViewBindElements/viewBindElementWidth'
import ViewBindElementStyle from './ViewBindElements/viewBindElementStyle'
import ViewBindElementClass from './ViewBindElements/viewBindElementClass'
import ViewBindElementScrollTop from './ViewBindElements/viewBindElementScrollTop'
import ViewBindElementChecked from './ViewBindElements/viewBindElementChecked'
import ViewBindElementOptions from './ViewBindElements/viewBindElementOptions'

export class ViewBindElementFactory{


    /**
     * Standard binds
     */
    private static viewBindList :{[bindName: string] : (element: HTMLElement, name: string, argList: string[])=>IViewBindElement } = {
        innerHtml: (element, name, argList) =>{return new ViewBindElementInnerHtml(element, name, argList)},
        text: (element, name, argList) =>{return new ViewBindElementInnerText(element, name, argList)},
        value: (element, name, argList) =>{return new ViewBindElementValue(element, name, argList)},
        visibility: (element, name, argList) =>{return new ViewBindElementVisibility(element, name, argList)},
        display: (element, name, argList) =>{return new ViewBindElementDisplay(element, name, argList)},
        attr: (element, name, argList) =>{return new ViewBindElementAttribute(element, name, argList)},
        size: (element, name, argList) =>{return new ViewBindElementSize(element, name, argList)},
        height: (element, name, argList) =>{return new ViewBindElementHeight(element, name, argList)},
        width: (element, name, argList) =>{return new ViewBindElementWidth(element, name, argList)},
        style: (element, name, argList) =>{return new ViewBindElementStyle(element, name, argList)},
        class: (element, name, argList) =>{return new ViewBindElementClass(element, name, argList)},
        scrollTop: (element, name, argList) =>{return new ViewBindElementScrollTop(element, name, argList)},
        checked: (element, name, argList) =>{return new ViewBindElementChecked(element, name, argList)},
        option: (element, name, argList) =>{return new ViewBindElementOptions(element, name, argList)}
        
    };

    static getBindElement(type: string, element: HTMLElement, name:string, argList: string[]): IViewBindElement{

        if(type in this.viewBindList){
            return this.viewBindList[type](element, name, argList);
        } else {
            return this.viewBindList['innerHtml'](element, name, argList);
        }

    }

    static registerBindElement(name: string, bindElement: (element: HTMLElement, name: string, argList: string[])=>IViewBindElement){
        if( !(name in this.viewBindList)){
            this.viewBindList[name] = bindElement;
        } 
    }

}