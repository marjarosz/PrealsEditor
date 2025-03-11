import { Command, ICommand } from "../MVVM/command";
import { IViewModel, ViewModel } from "../MVVM/viewModel";

export interface IViewModelPlanNavigation extends IViewModel {

}

export class ViewModelPlanNavigation extends ViewModel implements IViewModelPlanNavigation {
    
    constructor(){
        super();

        this.registerCommand("addPlanCommand", new Command(this.addPlanCommand.bind(this)));
        this.registerCommand("editPlanCommand", new Command(this.editPlanCommand.bind(this)));
    }


    private addPlanCommand(command:ICommand){

        console.log("Add polan");

    }

    private editPlanCommand(command:ICommand){

        console.log("Edit polan");

    }

}