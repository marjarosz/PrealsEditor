import { IViewModel } from "../MVVM/viewModel";
import * as viewModelHandlers from './viewModelHandlers';

export interface IViewModelFactory {
    getViewModel(viewModelName: string, ...args: any[]): IViewModel
}

export class ViewModelFactory implements IViewModelFactory{

    getViewModel(viewModelName: string, ...args: any[]){

        try {
            return new (<any>viewModelHandlers)[viewModelName](...args) as IViewModel;
        } catch(e) {
            throw 'ViewModel: '+viewModelName+' not exist in list or Error message:' + e ;
        }
    }
        
}
