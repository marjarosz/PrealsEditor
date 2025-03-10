import { IViewBindElement, ViewBindElement } from "../viewBindElement";


export default class ViewBindElementClass extends ViewBindElement implements IViewBindElement {

    private _lastClass: string = '';

    setValue(value: unknown): void {
        
        const valType = typeof value;

        if(valType === 'string'){
            
            if(this._lastClass){
                //Usun poprzednio ustawione class
                const toRemove = this.getClassListArray(this._lastClass);         
                this.element.classList.remove(...toRemove);
            }

            
            if(value){
                //Ustaw nowe 
                const addClass = this.getClassListArray(value as string);
                this.element.classList.add(...addClass); 
                
            }

            this._lastClass = value as string;         
        }

    }

    private getClassListArray(classString: string){
        const list = classString.split(' ');

        return list;
    }
}