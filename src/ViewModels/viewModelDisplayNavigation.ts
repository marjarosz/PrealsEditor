import { IEditor } from "../editor/editor";
import { Command, ICommand } from "../MVVM/command";
import { IViewModel, ViewModel } from "../MVVM/viewModel";

export interface IViewModelDisplayNavigation extends IViewModel {

}

interface IDisplayCommandInfo {
    className: string;
    isEnabled: boolean;
    clickCallback?: ()=>void;
}

export class ViewModelDisplayNavigation extends ViewModel implements IViewModelDisplayNavigation {
    
    private _displayCommands:{[commandName: string] : IDisplayCommandInfo} = {
        planDisplayCommand: {className: "planDisplayClass", isEnabled: true},
        gridDisplayCommand: {className: "gridDisplayClass", isEnabled: true},
        roomDisplayCommand: {className: "roomDisplayClass", isEnabled: true},
        iotDisplayCommand: {className: "iotDisplayClass", isEnabled: true},
        devicesDisplayCommand: {className: "devicesDisplayClass", isEnabled: true},
        eqDisplayCommand: {className: "eqDisplayClass", isEnabled: true},
        doorDisplayCommand: {className: "doorDisplayClass", isEnabled: true},
        windowDisplayCommand: {className: "windowDisplayClass", isEnabled: true},
        metterDisplayCommand: {className: "metterDisplayClass", isEnabled: true},
        trackDisplayCommand: {className: "trackDisplayClass", isEnabled: true},
        edgeDisplayCommand: {className: "edgeDisplayClass", isEnabled: true},
    };


    constructor(protected editor:IEditor){
        super();

        for(const key in this._displayCommands){
            const com:IDisplayCommandInfo = this._displayCommands[key];
            this.registerProperty(com.className, (com.isEnabled) ? "navTopItemActive" : "");
            this.registerCommand(key, new Command(this.setDisplayCommand.bind(this)));
        }

        /**
         * Wlacz wylacz siatke callback
         */
        this._displayCommands['gridDisplayCommand'].clickCallback = ()=>{
          
            const isEG = !this.editor.enableGrid;
            this.editor.enableDisableGrid(isEG);
        }
    }


    private setDisplayCommand(command: ICommand){

        const com:IDisplayCommandInfo = this._displayCommands[command.commandData.commandName];
        com.isEnabled = !com.isEnabled;
        this.setPropertyValueChange(com.className, (com.isEnabled) ? "navTopItemActive" : "");

        if(com.clickCallback){
            com.clickCallback();
        }
        
        console.log(command.commandData.commandName)

    }
}