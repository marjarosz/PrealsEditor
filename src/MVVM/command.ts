import { CommandActionEvent } from "./commandActionEvent";

type CommanData = {
    commandName: string,
    objectSender: object,
    args: string[]
}

export interface ICommand {

    readonly commandData: CommanData

    execute(event: CommandActionEvent): void;

}

export class Command implements ICommand{


    

    private _commandData: CommanData = {
        commandName: '',
        objectSender: {},
        args: []
    }

    constructor(private executeCallback: (comand: ICommand)=>void){
        
    }

    get commandData(){
        return this._commandData;
    }

    public execute(event: CommandActionEvent) {

        this._commandData.commandName = event.commandName;
        this._commandData.objectSender= event.objectSender;
        this._commandData.args = event.args;

        this.executeCallback(this);
    }

    

}



