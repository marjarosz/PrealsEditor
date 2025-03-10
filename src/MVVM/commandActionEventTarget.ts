import {CommandActionEvent} from './commandActionEvent'

export interface ICommandActionEventTarget extends EventTarget{
    commandAction(commandName: string, objectSender: object, ...args: string[]):void
}

export class CommandActionEventTarget extends EventTarget implements ICommandActionEventTarget{

    public commandAction(commandName: string, objectSender: object, ...args: string[]){
        this.dispatchEvent(new CommandActionEvent('command-action', commandName, objectSender, args));
    }

    

}