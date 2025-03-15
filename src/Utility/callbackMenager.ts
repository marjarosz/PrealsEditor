
export interface ICallbackMenager<F extends (...args: any[]) => any> {
    
    /**
     * Dodaj callback
     * @param callback 
     */
    addCallback(callback: F):void;

    /**
     * 
     * Usun callback
     * @param callback 
     */
    removeCallback(callback: F):void;

    /**
     * Wywolaj callbacks
     * @param args 
     */
    callCallback(...args: Parameters<F>):void;

}

export class CallbackMenager<F extends (...args: any[]) => any> {

    protected callbacks: F[] = [];

    addCallback(callback: F):void{

        this.callbacks.push(callback);
    }

    removeCallback(callback: F):void{

        this.callbacks = this.callbacks.filter(f=>f !== callback);

    }

    callCallback(...args: Parameters<F>){
        
        for(const f of this.callbacks) {
            f(...args);
        }
       
    }

}