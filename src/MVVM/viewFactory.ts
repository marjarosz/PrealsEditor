import {View, IView} from './view'
import {IViewModelView} from './viewModel'

export interface IViewFactory{

    getView(template: HTMLTemplateElement | string, dataContext: IViewModelView) : IView

}

export class ViewFactory implements IViewFactory{

    getView(template: HTMLTemplateElement | string, dataContext: IViewModelView) {
        return new View(template, dataContext);
    }

}