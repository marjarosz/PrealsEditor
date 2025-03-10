
import {IViewModelView} from './viewModel'
import {IPropertyChangeEvent} from './propertyChangeEvent'
import {BindWay} from './bindWay'
import {IViewBindElement} from './viewBindElement'
import {ViewBindElementFactory} from './viewBindElementFactory'
import {IViewCommandElement} from './viewCommandElement'
import {ViewCommandElementFactory} from './viewCommandElementFactory'
import {CommandActionEvent} from './commandActionEvent'
import { IViewValidateErrorElement } from './viewValidateErrorElement'
import { ViewValidateErrorElementFactory } from './viewValidateErrorElementFactory'
import { IValidateErrorChange } from './validateErrorChangeEvent'



export interface IView {
    
    //readonly template: HTMLTemplateElement;

    readonly viewNodeList: ChildNode[]

    name: string;

    disposeDataContext: boolean;

    readonly dataContext: IViewModelView | undefined;

    removeFromParentNodeList(): void;

    dispose(): void;
}

type BindProp = {
    propName: string;
    propType: string;
    args: string[];

}



export class View implements IView {

    public disposeDataContext: boolean = true;

    get dataContext(){
        return this._dataContext;
    }

    protected _nodeList: ChildNode[] = [];

    get viewNodeList(){
        return this._nodeList;
    }

    public name: string = '';

    protected properties: {[name: string]: IViewBindElement[]} = {};

    protected commands: {[name: string]: IViewCommandElement[]} = {}; 

    protected errors: {[name: string]: IViewValidateErrorElement[]} = {}

    protected _dataContext? : IViewModelView;

    private propDisableName = '';

    constructor(template: HTMLElement | string, context?: IViewModelView)
    {

        this._dataContext = context;
      

        if(this._dataContext){
            //this.dataContext.propertyChange.addEventListener('property-change', this.propertyChange.bind(this));
            this._dataContext.subscribeProperties(this.propertyChange.bind(this));
            this._dataContext.subscribeValidateError(this.errorValidateChange.bind(this));
        }

        const importedNode =  this.prepareTemplate(template);
        
        this.prepareCommands(importedNode);
        this.prepareProperties(importedNode);
        this.prepareValidateError(importedNode);

        
    }

    public removeFromParentNodeList(){
        
        for(const node of this._nodeList){
            node.remove();
        }
    }

    private prepareTemplate(template: HTMLElement | string){

        let importedNode: DocumentFragment = new DocumentFragment();

        if(template instanceof HTMLElement) {

            if(template instanceof HTMLTemplateElement){
                //this.template.content.append(template.content.cloneNode(true));
                importedNode = document.importNode(template.content, true);
                this._nodeList.push(...importedNode.children);

            } else {
                
                //this.template.content.append(template);
                const templateTemp = document.createElement('template');
                templateTemp.content.append(template);
                importedNode = document.importNode(templateTemp.content, true);
                this._nodeList.push(...importedNode.children);
            }

        } else {
            let temp = document.getElementById(template);

            if(temp){

                if(temp instanceof HTMLTemplateElement){
                    
                    importedNode = document.importNode(temp.content, true);
                    this._nodeList.push(...importedNode.children);
                } else {   

                    const templateTemp = document.createElement('template');
                    templateTemp.content.append(temp);
                    importedNode = document.importNode(templateTemp.content, true);          
                    this._nodeList.push(...importedNode.children);

                }

            } 
            
        }

        return importedNode;

    }

    private prepareProperties(importedNode: DocumentFragment){
        const binds =  importedNode.querySelectorAll("[data-bind]");

        for (const bn of binds){
           const bindsData = bn.attributes.getNamedItem('data-bind')?.nodeValue as string;
           if(bindsData){
               
                const bindsArray = this.getBindsArray(bindsData);

                for (const singleBind of bindsArray){

                    const bindElemntProp = this.getBindProp(singleBind);

                    if(bindElemntProp.propName && bindElemntProp.propType){
                        const propObject = ViewBindElementFactory.getBindElement(bindElemntProp.propType, bn as HTMLElement, bindElemntProp.propName, bindElemntProp.args);              

                        if(bindElemntProp.propName in this.properties){
                                this.properties[bindElemntProp.propName].push(propObject);
                        } else {
                                this.properties[bindElemntProp.propName] = [propObject];
                        }

                        if(this._dataContext && propObject.bindWay != BindWay.fromViewToViewModel){
                            const val = this._dataContext.getPropertyValue(bindElemntProp.propName);
                            propObject.setValue(val);
                        }

                        if(propObject.bindWay != BindWay.fromViewModelToView){
                            propObject.subscribe(this.propertyElementChange.bind(this));
                        }
                    }
                }

                bn.removeAttribute('data-bind');
           }     
        }
    }


    private prepareCommands(importedNode: DocumentFragment){

       
        const commands = importedNode.querySelectorAll("[data-command]");
        
        for (const cm of commands){
            const bindsCommand = cm.attributes.getNamedItem('data-command')?.nodeValue as string;
            if(bindsCommand){
                const commandsArray = this.getBindsArray(bindsCommand);
                for (const singleCommand of commandsArray){

                    const bindElemntProp = this.getBindProp(singleCommand);

                    if(bindElemntProp.propName && bindElemntProp.propType){
                        const commandObj = ViewCommandElementFactory.getCommandElement(bindElemntProp.propType, cm as HTMLElement, bindElemntProp.propName, bindElemntProp.args);
                        commandObj.subscribe(this.commandEvent.bind(this));

                        if(bindElemntProp.propName in this.commands){
                            this.commands[bindElemntProp.propName].push(commandObj)
                        } else {
                            this.commands[bindElemntProp.propName] = [commandObj];
                        }
                    }

                }
                cm.removeAttribute('data-command');
            }

        }

    }

    private prepareValidateError(importedNode: DocumentFragment) {
        const  valErrors = importedNode.querySelectorAll("[data-validate-error]");

        
        for (const ve of valErrors){
            
            const bindsVE = ve.attributes.getNamedItem('data-validate-error')?.nodeValue as string;
            
            if(bindsVE){
                const veArray = this.getBindsArray(bindsVE);
                for(const singleVal of veArray){
                    const bindElementVE = this.getBindProp(singleVal);
                    if(bindElementVE.propName && bindElementVE.propType){
                        const errorObj = ViewValidateErrorElementFactory.getErrorElement(bindElementVE.propType, ve as HTMLElement, bindElementVE.propName, bindElementVE.args);
                        ve.addEventListener('focusin', ()=>{
                            /**
                             * Ddoaje validacje podczas focusin 
                             */
                            if(this._dataContext){
                                this._dataContext.validateProperty(bindElementVE.propName);
                            }
                        })
                        if(bindElementVE.propName in this.errors){
                            this.errors[bindElementVE.propName].push(errorObj); 
                        } else {
                            this.errors[bindElementVE.propName] = [errorObj];
                        }
                    }
                }   
            }
            ve.removeAttribute('data-validate-error');
        }
    }

    private getBindsArray(bindsData: string){

        let sidx = -1;
        let eidx = 0;
                 
        const bindsArray = [];

        while(eidx > -1){
            sidx = bindsData.indexOf('{', sidx+1);
            eidx = bindsData.indexOf('}', eidx+1);

            if (sidx == -1 || eidx == -1) {
                break;
            }
            
            bindsArray.push(bindsData.substring(sidx+1, eidx));                
        }

        return bindsArray;
    }

    private getBindProp(singleBind: string){

        let retBind: BindProp = {
            propName: '',
            propType: '',
            args: []
        }

        const bindElement = singleBind.split(',');
        
        const bindElementProp = bindElement[0].split(':');

        if(bindElementProp.length >=2){
            retBind.propName = bindElementProp[1].trim();
            retBind.propType = bindElementProp[0].trim();
        }

        if(bindElement.length > 1){
            retBind.args = bindElement.slice(1, bindElement.length);
        }

        return retBind;

    }

    public dispose(): void {
        if(this._dataContext && this.disposeDataContext){
            this._dataContext.dispose();
        }
    }

    private propertyChange(event : Event){

       

        if((event as IPropertyChangeEvent).propertyName in this.properties && (event as IPropertyChangeEvent).propertyName != this.propDisableName){

            for (const proBind of this.properties[(event as IPropertyChangeEvent).propertyName]){
                if(proBind.bindWay != BindWay.fromViewToViewModel) {
                    proBind.setValue((event as IPropertyChangeEvent).value);
                }
            
            }
   
        }

    }

    private errorValidateChange(event: Event) {
       
        if((event as IValidateErrorChange).propertyName in this.errors){
            for(const erCh of this.errors[(event as IValidateErrorChange).propertyName]){
                erCh.setValid((event as IValidateErrorChange).isValid);
            }
        }
    }

    private propertyElementChange(event: Event){
        if(this._dataContext){
            this._dataContext.setPropertyValue( (event as IPropertyChangeEvent).propertyName, (event as IPropertyChangeEvent).value );
        }

    }


    private commandEvent(event: Event){

        if(this._dataContext){
            const command = this._dataContext.getCommand((event as CommandActionEvent).commandName);
            if(command){
                command.execute(event as CommandActionEvent);
            }
        }
       
    }

}