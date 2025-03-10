export interface ICommandActionEvent extends Event{

    readonly commandName: string;
    readonly objectSender: object;
    readonly args: string[];

}

export class CommandActionEvent extends Event implements ICommandActionEvent {

    constructor(type: string, public readonly commandName: string, public readonly objectSender: object, public readonly args: string[]){
        super(type);
    }

}