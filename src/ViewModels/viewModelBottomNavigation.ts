import { IEditor } from "../editor/editor";
import { Command, ICommand } from "../MVVM/command";
import { IViewModel, ViewModel } from "../MVVM/viewModel";

export interface IViewModelBottomNavigation extends IViewModel {

}

interface IBottomCommandInfo  {
    className: string;
    isSelectable: boolean;
    isLock: boolean;
    clickCallback?: ()=>void
}

export class ViewModelBottomNavigation extends ViewModel implements IViewModel {
    

    private _bottomCommands:{[commandName: string] : IBottomCommandInfo} = {

        fullScreenOnCommand:{className: 'fullScreenOnClass', isLock: false, isSelectable: true},
        centerCommand:{className: 'centerClass', isLock: false, isSelectable: false},
        zoomInCommand:{className: 'zoomInClass', isLock: false, isSelectable: false},
        zoomOutCommand:{className: 'zoomOutClass', isLock: false, isSelectable: false},
        set3DCommand:{className: 'set3DClass', isLock: true, isSelectable: false},
        downloadCommand:{className: 'downloadClass', isLock: false, isSelectable: false}
    }

    constructor(protected editor:IEditor){
        super();


        for(const key in this._bottomCommands){

            const com:IBottomCommandInfo = this._bottomCommands[key];
            this.registerProperty(com.className, (com.isLock) ? "navLock" : "");
            this.registerCommand(key, new Command(this.bottomCommand.bind(this)));
        }

        this.editor.subscribeZoomChange(this.zoomChanged.bind(this));
        this._bottomCommands["zoomInCommand"].clickCallback = ()=>{
            this.editor.zoomIn();
        }

        this._bottomCommands['zoomOutCommand'].clickCallback = ()=>{
            this.editor.zoomOut();
        }

    }

    private bottomCommand(command: ICommand){

        const com:IBottomCommandInfo = this._bottomCommands[command.commandData.commandName];

        if(com.isLock) {
            return;
        }

        if(com.clickCallback) {
            com.clickCallback();
        }

        console.log(command.commandData.commandName);

    }

    private zoomChanged(currentZoom: number){

        this._bottomCommands["zoomInCommand"].isLock = !this.editor.zoomInAvailable;
        this._bottomCommands["zoomOutCommand"].isLock = !this.editor.zoomOutAvailable;

        this.setPropertyValueChange(this._bottomCommands["zoomInCommand"].className, (this.editor.zoomInAvailable) ? "" : "navLock");
        this.setPropertyValueChange(this._bottomCommands["zoomOutCommand"].className, (this.editor.zoomOutAvailable)? "" : "navLock");

    }

}