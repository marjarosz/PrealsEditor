import { IEditor } from "../editor/editor";
import { IViewModel, ViewModel } from "../MVVM/viewModel";
import { propChange } from "../MVVM/viewModelDecorators";
import { EditorMath } from "../Utility/editorMath";

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

    constructor(private editor: IEditor){
        super();

        this.currentScale = "1:25";
        this.currentZoom = "x5" + EditorMath.numberFixed(this.editor.currentZoom, 0);
        this.opacityValue = "90";
        this.opacityValuePercent = "90%";
        
        this.editor.subscribeZoomChange(this.zoomChanged.bind(this));
       
    }

    public opacityChange(target:object, propertyKey:string){

        this.opacityValuePercent = this.opacityValue + "%";
       
        console.log(propertyKey)

    }


    private zoomChanged(currentZoom: number) {

        this.currentZoom = "x"+EditorMath.numberFixed(currentZoom, 0);

    }
}