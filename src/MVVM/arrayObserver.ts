export enum ChangeType  {
    
    delete = 0,
    addFirst = 1,
    addLast = 2,
    insertAfter = 3
    
}

export class ArrayObserver<T> extends Array
{
 
    public changeCallback: (items: T[], changeType: ChangeType, beforaOrAfter?: T)=>void = (items)=>{}

    push(...items: T[]): number {
        super.push(...items);
        this.changeCallback(items, ChangeType.addLast);
        return this.length;
    }

    unshift(...items: T[]): number {
        super.unshift(...items);
        this.changeCallback(items, ChangeType.addFirst);
        return this.length;

    }

    pop() {

        let removed;
        if(this.length > 0){           
            removed = this[this.length-1]
        }
        super.pop();
        if(removed){
            this.changeCallback(this[this.length-1], ChangeType.delete);
        }
    }

    shift() {
        let removed;
        if(this.length > 0){
            removed = this[0];
        }
        super.shift();
        if(removed){
            this.changeCallback(this[0], ChangeType.delete);
        }
    }

    splice(start: number, deleteCount?: number, ...items: T[]): T[]
    {

        let removed;

        if(deleteCount!= undefined){
            removed = super.splice(start, deleteCount, ...items);
        } else {
            removed = super.splice(start);
        }

        const removedArray = new Array();
        removedArray.push(...removed);

        if(removed.length > 0){
            this.changeCallback(removedArray, ChangeType.delete);
        }
        

        if(items.length > 0){
            if(start == 0 && removed.length > 0){
                this.changeCallback(items, ChangeType.addLast);
            } else {
               
                if(removed.length > 0){
                    
                    this.changeCallback(items, ChangeType.insertAfter, this[start]);
                } else {
                    this.changeCallback(items, ChangeType.insertAfter, this[start-1]);
                    
                }

            }
            
        }
        

        return removed;
        
    }

    insertAfter(index: number, ...item:T[]){
        this.splice(index+1, 0, ...item);
    }

    clear(){
        for (const item of this){
            this.changeCallback([item], ChangeType.delete);
        }
        this.length = 0;
    }

    deleteItem(item: T){

        const idx = this.indexOf(item);
        if(idx > -1){
            this.splice(idx, 1);
        }

        return idx;

    }

}