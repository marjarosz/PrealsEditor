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

    private _toolsNavigationVM: IViewModelToolsNavigation;
    private _scaleNavigationVM: IViewModelToolsNavigation;
    private _planNavigationVM: IViewModelPlanNavigation;
    private _displayNavigationVM: IViewModelDisplayNavigation;
    private _bottomNavigationVM: IViewModelBottomNavigation;

    constructor(protected viewModelFactory:IViewModelFactory){
        super();

        
        //Tools navigation
        const toolsViewHtml = document.createElement("template");
        toolsViewHtml.innerHTML = toolsNavTemplate;
        this._toolsNavigationVM = viewModelFactory.getViewModel("ViewModelToolsNavigation");
        this.toolsNavigation = new View(toolsViewHtml, this._toolsNavigationVM);

        //Scale navigation
        const scaleViewHtml = document.createElement("template");
        scaleViewHtml.innerHTML = scaleNavTemplat;
        this._scaleNavigationVM = viewModelFactory.getViewModel("ViewModelToolsNavigation");
        this.scaleNavigation = new View(scaleViewHtml, this._scaleNavigationVM);

        //Plan navigation
        const planViewHtml = document.createElement("template");
        planViewHtml.innerHTML = planNavTemplate;
        this._planNavigationVM = viewModelFactory.getViewModel("ViewModelPlanNavigation");
        this.planNavigation = new View(planViewHtml, this._planNavigationVM);

        //Display navigation
        const displayViewHtml = document.createElement("template");
        displayViewHtml.innerHTML = displayNavTemplate;
        this._displayNavigationVM = viewModelFactory.getViewModel("ViewModelDisplayNavigation");
        this.displayNavigation = new View(displayViewHtml, this._displayNavigationVM);

        //Bottom navigation
        const bottomViewHtml = document.createElement("template");
        bottomViewHtml.innerHTML = bottomNavTemplate;
        this._bottomNavigationVM = viewModelFactory.getViewModel('ViewModelBottomNavigation');
        this.bottomNavigation = new View(bottomViewHtml, this._bottomNavigationVM);

    }

}