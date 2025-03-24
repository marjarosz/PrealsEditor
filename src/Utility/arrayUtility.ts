/**
 * Utility dla Array
 */

export class ArrayUtility<T, U>
{
    /**
     * 
     * Wyszukuje element z tablicy obiektow po nazwie pola
     * Zwraca pierwszy znaleziony element
     * 
     * @param arrayList tablica obiektow
     * @param key klucz
     * @param keyValue wartosc
     * @returns 
     */
    static getItemByFieldValue<T extends object, U extends keyof T>(array: T[], key: U, keyValue: any) : T | undefined{
        
        return array.find(function(item){           
            return item[key] === keyValue;
        })
    }

    /**
     * 
     * Wyszukuje elementy z tablicy obiektow po naziwe pola
     * 
     * @param arrayList tablica obiektow
     * @param key klucz
     * @param keyValue wartosc
     * @returns 
     */
    static getItemsByFieldValue<T extends object, U extends keyof T>(array: T[], key: U, keyValue: any) : T[]{
        
        return array.filter(function(item){           
            return item[key] === keyValue;
        })
    }

    /**
     * 
     * Usuwa element z tablicy
     * 
     * @param array tablica
     * @param toRemove element do usuniecia
     * @returns 
     */

    static removeItemFromArray<T>(array: T[], toRemove: T) : boolean{
        let idxToRemove =  array.indexOf(toRemove);
        if(idxToRemove > -1){
            array.splice(idxToRemove, 1);
            return true;
        }

        return false;
    }


    /**
     * 
     * Usuwa element z tablicy obiektow po nazwie pola
     * 
     * @param arrayList tablica obiektow
     * @param key klucz
     * @param keyValue wartosc
     * @returns 
     */    
    static removeItemByFieldValue<T extends object, U extends keyof T>(array: T[], key: U, keyValue: any): boolean{
    
        let toRemove = this.getItemByFieldValue(array, key, keyValue);
        
        if(toRemove){
            return this.removeItemFromArray(array, toRemove);     
        }
        return false;
    
    }

    /**
     * 
     * Usuwa elementy z tablicy obiektow po nazwie pola
     * 
     * @param arrayList lista obiektow
     * @param key klocz
     * @param keyValue wartosc
     * @returns 
     */
    static removeItemsByFieldValue<T extends object, U extends keyof T>(array: T[], key: U, keyValue: any): boolean{
    
        let toRemoves = this.getItemsByFieldValue(array, key, keyValue);
        let isRemoved = false;
        
        for(const toRemove of toRemoves){
           isRemoved = this.removeItemFromArray(array, toRemove);
        }
    
        return isRemoved;
    }

}




