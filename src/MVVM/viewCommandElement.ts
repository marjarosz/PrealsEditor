import {ICommandActionEventTarget} from './commandActionEventTarget'


export interface IViewCommandElement {

    subscribe(functionEvent: (event: Event)=>void):void;
    unsubscribe(functionEvent: (event: Event)=>void):void;

}

export abstract class ViewCommandElement {


    protected args: {[argName: string]: string} = {};

    constructor(protected element: HTMLElement, protected commandName: string, argList: string[], protected eventTarget: ICommandActionEventTarget){
        
        for (const arg of argList){
            const argArray = arg.split(':');
            if(argArray.length >=2){
                this.args[argArray[0].trim()] = argArray[1].trim();   
            }
        }

    }

    public subscribe(functionEvent: (event: Event)=>void){
        this.eventTarget.addEventListener('command-action', functionEvent);
    }

    public unsubscribe(functionEvent: (event: Event)=>void){
        this.eventTarget.removeEventListener('command-action', functionEvent);
    }

 

}


