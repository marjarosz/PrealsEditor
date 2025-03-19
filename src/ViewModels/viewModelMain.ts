import { IViewModel, ViewModel } from "../MVVM/viewModel";
import { IViewModelFactory } from "./viewModelFactory";


import { propChange } from "../MVVM/viewModelDecorators";
import { IViewModelToolsNavigation } from "./viewModelToolsNavigation";
import { IView, View } from "../MVVM/view";


import toolsNavTemplate from '../Views/toolsNav.html'
import scaleNavTemplat from '../Views/scaleNav.html'
import planNavTemplate from '../Views/planNav.html'
import displayNavTemplate from '../Views/displayNav.html'
import bottomNavTemplate from '../Views/bottomNav.html'

import { IViewModelPlanNavigation } from "./viewModelPlanNavigation";
import { IViewModelDisplayNavigation } from "./viewModelDisplayNavigation";
import { IViewModelBottomNavigation } from "./viewModelBottomNavigation";
import { Command, ICommand } from "../MVVM/command";
import { IEditor } from "../editor/editor";

export interface IViewModelMain extends IViewModel{

}

export class ViewModelMain extends ViewModel implements IViewModelMain {


    @propChange()
    public toolsNavigation: IView;

    @propChange()
    public scaleNavigation: IView;

    @propChange()
    public planNavigation: IView;

    @propChange()
    public displayNavigation: IView;

    @propChange()
    public bottomNavigation: IView;

    @propChange('editorWidthChange')
    public editorWidth: string = "";

    @propChange('editorHeightChange')
    public editorHeight: string = "";

    @propChange()
    public editorHtml: HTMLElement;

    private _toolsNavigationVM: IViewModelToolsNavigation;
    private _scaleNavigationVM: IViewModelToolsNavigation;
    private _planNavigationVM: IViewModelPlanNavigation;
    private _displayNavigationVM: IViewModelDisplayNavigation;
    private _bottomNavigationVM: IViewModelBottomNavigation;

    private _resizeInterval!: NodeJS.Timeout;

    constructor(protected viewModelFactory:IViewModelFactory, protected editor:IEditor){
        super();

        
        //Tools navigation
        const toolsViewHtml = document.createElement("template");
        toolsViewHtml.innerHTML = toolsNavTemplate;
        this._toolsNavigationVM = viewModelFactory.getViewModel("ViewModelToolsNavigation", editor);
        this.toolsNavigation = new View(toolsViewHtml, this._toolsNavigationVM);

        //Scale navigation
        const scaleViewHtml = document.createElement("template");
        scaleViewHtml.innerHTML = scaleNavTemplat;
        this._scaleNavigationVM = viewModelFactory.getViewModel("ViewModelScaleNavigation", editor);
        this.scaleNavigation = new View(scaleViewHtml, this._scaleNavigationVM);

        //Plan navigation
        const planViewHtml = document.createElement("template");
        planViewHtml.innerHTML = planNavTemplate;
        this._planNavigationVM = viewModelFactory.getViewModel("ViewModelPlanNavigation");
        this.planNavigation = new View(planViewHtml, this._planNavigationVM);

        //Display navigation
        const displayViewHtml = document.createElement("template");
        displayViewHtml.innerHTML = displayNavTemplate;
        this._displayNavigationVM = viewModelFactory.getViewModel("ViewModelDisplayNavigation", editor);
        this.displayNavigation = new View(displayViewHtml, this._displayNavigationVM);

        //Bottom navigation
        const bottomViewHtml = document.createElement("template");
        bottomViewHtml.innerHTML = bottomNavTemplate;
        this._bottomNavigationVM = viewModelFactory.getViewModel('ViewModelBottomNavigation', editor);
        this.bottomNavigation = new View(bottomViewHtml, this._bottomNavigationVM);

        this.editorHtml = editor.renderer.domElement;
        
    }



    protected editorWidthChange(target: object, propertyKey: string){

        clearInterval(this._resizeInterval);
        this._resizeInterval = setTimeout(this.editorSizeChange.bind(this), 0);
       
    }

    protected editorHeightChange(target: object, propertyKey: string){

        clearInterval(this._resizeInterval);
        this._resizeInterval = setTimeout(this.editorSizeChange.bind(this), 0);

    }

   
    protected editorSizeChange(){

        const w = parseInt(this.editorWidth);
        const h = parseInt(this.editorHeight);

        if(!isNaN(w) && !isNaN(h)){
            this.editor.setNewSize(w, h);
        }

    }
    

}