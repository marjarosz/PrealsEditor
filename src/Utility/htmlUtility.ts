
export class HtmlUtility {

    /**
     * Ustawia id dla elementu
     * @param element 
     * @param id 
     */
     static setId(element: HTMLElement, id: string | null){
        if(id){
            element.id = id;
        }
    }
    
    
    /**
     * Ustawia klasy dla elementu
     * 
     * @param element 
     * @param cl klasy odzielone spacja
     */
    static setClass(element: HTMLElement, cl: string | null){
        if(cl){
    
            let classes = cl.split(" ");
            element.classList.add(...classes);
    
        }
    
    }
    
    static createHtmlElement(tagName: string, id: string | null, cl: string | null): HTMLElement{
        let element = document.createElement(tagName);
        this.setId(element, id);
        this.setClass(element, cl);
        return element;
    }
    
    /**
     * 
     * Tworzy DIV
     * 
     * @param id 
     * @param cl 
     * @returns 
     */
    static createDivElement(id: string | null, cl:string | null): HTMLDivElement{
        let divElement = this.createHtmlElement('DIV', id, cl) as HTMLDivElement;
        return divElement;
    }
    

    /**
     * 
     * Tworzy SPAN
     * 
     * @param id 
     * @param cl 
     * @returns 
     */
    static createSpanElement(id: string | null, cl:string |null) :HTMLSpanElement{
        let spanElement = this.createHtmlElement('SPAN', id, cl) as HTMLSpanElement;
        return spanElement;
    }
    

    /**
     * 
     * Tworz INPUT
     * 
     * @param type 
     * @param id 
     * @param cl 
     * @returns 
     */
    static createInputType(type: string, id: string | null, cl: string | null) :  HTMLInputElement{
        let input = this.createHtmlElement('INPUT', id, cl) as HTMLInputElement;
        input.type = type;
        return input;
    }

    static clearElement(element: HTMLElement){
        while(element.lastChild){
            element.lastChild.remove();
        }
    }
}


