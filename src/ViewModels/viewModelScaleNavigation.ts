import { IViewModel, ViewModel } from "../MVVM/viewModel";
import { propChange } from "../MVVM/viewModelDecorators";

export interface IViewModelScaleNavigation extends IViewModel {

}

export class ViewModelScaleNavigation extends ViewModel implements IViewModelScaleNavigation {
    
    @propChange()
    public currentScale:string;
    
    @propChange()
    public currentZoom:string;

    @propChange("opacityChange")
    public opacityValue:string;

    @propChange()
    public opacityValuePercent: string;

    constructor(){
        super();

        this.currentScale = "1:25";
        this.currentZoom = "x5";
        this.opacityValue = "90";
        this.opacityValuePercent = "90%";
    }

    public opacityChange(target:object, propertyKey:string){

        this.opacityValuePercent = this.opacityValue + "%";
       
        console.log(propertyKey)

    }

}