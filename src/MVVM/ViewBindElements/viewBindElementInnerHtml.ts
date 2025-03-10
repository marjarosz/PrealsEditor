
import {IViewBindElement, ViewBindElement} from '../viewBindElement'
import {IView, View} from '../view'
import { ArrayObserver, ChangeType } from '../arrayObserver';

export default class ViewBindElementInnerHtml extends ViewBindElement implements IViewBindElement{

    protected _isView: boolean = false;

    protected _viewOld?: IView;

    setValue(value: unknown){

        if(value instanceof Array){
            this.setValueArrayType(value);
        } else {
            this.setValueType(value);
        }
        

    }

    /**
     * Ustawia wartosc ze wzgledu na typ
     * 
     * @param value 
     */
    private setValueType(value: unknown){
        if(value instanceof HTMLElement){
            //HtmlUtility.clearElement(this.element);
            //this.element.append(value);
            this.insert(value);
        } else if(value instanceof View){
            //HtmlUtility.clearElement(this.element);
            //this.element.append( ...(value as View).viewNodeList );
            this.insertView(value as View);
            this._isView = true;
        } else {
            const val = this.prepareValue(value);
            this.element.innerHTML =val.toString();
        }
    }

    /**
     * Ustawia wartosc dla Tablicy
     * 
     * @param value - tablica
     */
    private setValueArrayType(value: unknown[]){


        for(const val of value){
            this.setValueType(val);
        }

        
        if(value instanceof ArrayObserver){
            //Jezeli jest widok
            if(this._isView){
                (value as ArrayObserver<IView>).changeCallback = this.observerChange.bind(this);
            } else {
                //nieznany typ
                (value as ArrayObserver<unknown>).changeCallback = this.observerChangeUnknowType.bind(this);
            }
            
        } 

    }

    /**
     * Wstawia wartosc -widok
     * 
     * @param value - widok
     */
    private insertView(value: IView){
       
       // this.element.append( ...value.viewNodeList );
        this.insert(...value.viewNodeList);
    }

    /**
     * Wstawia elementy przed lub po
     * 
     * @param childNode 
     */
    private insert(...childNode: (HTMLElement | Node)[]){
        if('place' in this.args){
            
            switch (this.args['place']) {
                case 'start' : this.element.prepend(...childNode);
                    break;
                case 'end' : this.element.append(...childNode);
                    break;
                default: this.element.append(...childNode);
            
            }
        } else {
            this.element.append(...childNode);
        }

        
    }

    /**
     * Zmiana w ArrayObserver
     *  
     * @param items - lista widokow do zmiany
     * @param changeType - typ zmiany
     * @param beforeOrAfter -vidok przed ktorym / po wstawic
     */
    private observerChange(items: IView[], changeType: ChangeType, beforeOrAfter?: IView){
       
        switch(changeType){
            case ChangeType.delete:
                for(const it of items){
                    it.removeFromParentNodeList();
                    it.dispose();
                }
                break;
            case ChangeType.addFirst:
                for(const it of items){
                    this.element.prepend(...it.viewNodeList)
                }
                break;
            case ChangeType.addLast:
                this.appendObserver(items);
                break;
            case ChangeType.insertAfter: 
                if(beforeOrAfter != undefined){
                    this.insertObserverAfter(items, beforeOrAfter);
             
                } else {
                    this.appendObserver(items);
                }
                break;
        }

    }

    //TODO dopisac do HTMLElement
    private observerChangeUnknowType(items: unknown[], changeType: ChangeType, beforeOrAfter?: unknown){
        if(items.length > 0 && items[0] instanceof View){
            this.observerChange(items as IView[], changeType, beforeOrAfter as IView);
        }
    }

    /**
     * Dodaje elementy na koniec
     * 
     * @param items - elemnty do wstawienia
     */
    private appendObserver(items: IView[]){
        for(const it of items){
            this.element.append(...it.viewNodeList)
        }
    }

    /**
     * Dodaje elemnty po elemencie
     * Jezeli liczba istniejacych elemntow jest 0 - wstawia metoda appendObserver
     * 
     * @param items - elemnty do wstawieia 
     * @param after - elemnt po ktorym wstawic
     */
    private insertObserverAfter(items: IView[], after: IView){
        let afterNode: ChildNode
        if(after.viewNodeList.length > 0){
            afterNode = after.viewNodeList[after.viewNodeList.length - 1];
            for(const it of items){
                afterNode.after(...it.viewNodeList);
                if(it.viewNodeList.length > 0){
                    afterNode = it.viewNodeList[it.viewNodeList.length-1];
                }
            }
        } else {
            this.appendObserver(items);
        }
    }
}