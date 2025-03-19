
export enum ActionType {
    ActionSelect = 0,
    ActionDraw = 1,
    //ActionEdit = 2,
    //ActionMove = 3,
    //ActionRotate = 4,
    //ActionDevide = 5,
    //ActionUnDevide = 6,
    //ActionMeasure = 7,
   // ActionDelete = 8,
    //DrawMarker = 9,
    //ActionRounding = 10,
    //ActionChangeAngle = 11,
    //ActionDropShape = 12,
    //RotateNinety = 13,
    //Trimming = 14,
    //ActionRenderOrderChange = 15,
   // ActionAlign = 16,
    //ActionPaste = 17
}


export interface IEditorAction {

    readonly actionType:ActionType;

    cancel():void;

}

export class EditorAction{

    constructor(){

    }

}