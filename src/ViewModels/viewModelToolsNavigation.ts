import { EditorDrawType } from "../editor/Action/editorActionDrawFactory";
import { IEditor } from "../editor/editor";
import { Command, ICommand } from "../MVVM/command";
import { IViewModel, ViewModel } from "../MVVM/viewModel";
import { propChange } from "../MVVM/viewModelDecorators";

export interface IViewModelToolsNavigation extends IViewModel{

}


interface IToolsCommandInfo  {
    className: string;
    isSelectable: boolean;
    isLock: boolean;
    clickCallback?: ()=>void
}

export class ViewModelToolsNavigation extends ViewModel implements IViewModelToolsNavigation {
    

    private _toolsCommands: {[commandName: string] : IToolsCommandInfo} = {
        selectCommand: {className: "selectClass", isSelectable: true, isLock: false},
        moveCommand: {className: "moveClass", isSelectable: true, isLock: false},
        freeCommand: {className: "freeClass", isSelectable: true, isLock: false},
        rectangleCommand: {className: "rectangleClass", isSelectable: true, isLock: false},
        rectangleCenterCommand: {className: "rectangleCenterClass", isSelectable: true, isLock: false},
        circleCommand: {className: "circleClass", isSelectable: true, isLock: false},
        circleCenterCommand: {className: "circleCenterClass", isSelectable: true, isLock: false},
        addPointCommand: {className: "addPointClass", isSelectable: true, isLock: false},
        removePointCommand: {className: "removePointClass", isSelectable: true, isLock: false},
        roundupCommand: {className: "roundupClass", isSelectable: true, isLock: false},
        measureCommand: {className: "measureClass", isSelectable: true, isLock: false},
        undoCommand: {className: "undoClass", isSelectable: false, isLock: true},
        redoCommand: {className: "redoClass", isSelectable: false, isLock: true},
        deleteCommand: {className: "deleteClass", isSelectable: true, isLock: false},
        cancelCommand: {className: "cancelClass", isSelectable: false, isLock: false}
    }


    private _currentToolsCommand: string = "";
    private _defaultTools: string = "selectCommand";

    constructor(private editor:IEditor){
        super();

        let activeClass = "navTopItemActive";
        for(const key in this._toolsCommands){
            this.registerCommand(key, new Command(this.toolsCommand.bind(this)));
            activeClass += (this._toolsCommands[key].isLock) ? "navLock" : "";
            this.registerProperty(this._toolsCommands[key].className, activeClass);
            activeClass = "";
            
        }

        this._currentToolsCommand = this._defaultTools;

        this._toolsCommands["cancelCommand"].clickCallback = this.cancelCommand.bind(this);

        this._toolsCommands["selectCommand"].clickCallback = ()=>{
            this.editor.selectAction();
        }

        /**
         * Rysowanie dowolnego ksztaltu
         */
        this._toolsCommands["freeCommand"].clickCallback = ()=>{
            this.editor.startDraw(EditorDrawType.free);
        }

        /**
         * Rysowanie prostokata z naroznika
         */
        this._toolsCommands["rectangleCommand"].clickCallback = ()=>{
            this.editor.startDraw(EditorDrawType.rectangleCorner);
        }

        /**
         * Rysowanie prostokata ze srodka
         */
        this._toolsCommands["rectangleCenterCommand"].clickCallback = ()=>{
            this.editor.startDraw(EditorDrawType.rectangleCenter);
        }

        /**
         * Okrag z naroznika
         */
        this._toolsCommands["circleCommand"].clickCallback = ()=>{
            this.editor.startDraw(EditorDrawType.circleCorner);
        }

        /**
         * Okrag ze srodka
         */
        this._toolsCommands["circleCenterCommand"].clickCallback = ()=> {
            this.editor.startDraw(EditorDrawType.circleCenter);
        }

    }


    private toolsCommand(command:ICommand){

        if(this._currentToolsCommand == command.commandData.commandName || this._toolsCommands[command.commandData.commandName].isLock){
            return;
        }

        this.setCurrentTool(command.commandData.commandName)
        
        if(this._toolsCommands[command.commandData.commandName].clickCallback != undefined) {
            this._toolsCommands[command.commandData.commandName].clickCallback!(); 
        }
        console.log(command.commandData.commandName);
    }


    private cancelCommand(){

        this.editor.cancelAction();

        if(this._currentToolsCommand == "selectCommand"){
            return;
        }
        this.setCurrentTool("selectCommand");
  
    }

    private setCurrentTool(commandName: string):boolean{

        const toolInfo:IToolsCommandInfo  = this._toolsCommands[commandName];

        if(toolInfo.isSelectable){
            this.setPropertyValueChange(this._toolsCommands[this._currentToolsCommand].className, "");
            this.setPropertyValueChange(toolInfo.className, "navTopItemActive");
            this._currentToolsCommand = commandName;
            return true;
        }

        return false;
    }
}