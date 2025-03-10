
import { IViewModelValidator, ViewModelValidatorNoEmpty } from './Validators/viewModelValidator';
import { ViewModelValidatorEmail } from './Validators/viewModelValidatorEmail';
import { ViewModelValidatorInteger } from './Validators/viewModelValidatorInteger';
import { ViewModelValidatorLength } from './Validators/viewModelValidatorLength';
import { ViewModelValidatorPhone } from './Validators/viewModelValidatorPhone';
import { ViewModelValidatorTrue } from './Validators/viewModelValidatorTrue';
import { IViewModel} from './viewModel';

function setProperty(obj: IViewModel, newValue: unknown, propertyKey: string, callback?: string){
  if(!obj.hasRegistredProperty(propertyKey)){

    if(callback){
      const prot = Object.getPrototypeOf(obj);
      
      if(prot[callback]){
        obj.registerProperty(propertyKey, newValue, prot[callback].bind(obj));
      } else {
        obj.registerProperty(propertyKey, newValue);
      }
     
    } else {
      obj.registerProperty(propertyKey, newValue);
    }

  } else {
    obj.setPropertyValueChange(propertyKey, newValue);
  }
}



function getPropertyGetter(propertyKey: string){
  return function(this: IViewModel){
    return this.getPropertyValue(propertyKey);      
  }
}

function getPropertySetter(propertyKey: string, callback?: string){
  return function(this: IViewModel, newValue: unknown){
    setProperty(this, newValue, propertyKey, callback);
  }
}



function getPropertySetterValidatorNoEmpty(propertyKey: string, callback?: string) {
  return function(this: IViewModel, newValue: unknown){
    
    setProperty(this, newValue, propertyKey, callback);
    if(this.hasPropertyValidator(propertyKey)) {
      this.validateProperty(propertyKey);
    } else {
      const val = new ViewModelValidatorNoEmpty();
      this.registerPropertyValidator(propertyKey, [val]);
     
    }
  }
}

function getPropertySetterValidatorLenght(propertyKey: string, minLength:number, maxLength?:number, callback?: string) {
  return function(this: IViewModel, newValue: unknown){
    
    setProperty(this, newValue, propertyKey, callback);
    if(this.hasPropertyValidator(propertyKey)) {
      this.validateProperty(propertyKey);
    } else {
      const val = new ViewModelValidatorLength(minLength, maxLength);
      this.registerPropertyValidator(propertyKey, [val]);
     
    }
  }
}


function getPropertySetterValidatorEmail(propertyKey: string, callback?: string) {
  return function(this: IViewModel, newValue: unknown){
    
    setProperty(this, newValue, propertyKey, callback);
    if(this.hasPropertyValidator(propertyKey)) {
      this.validateProperty(propertyKey);
    } else {
      const val = new ViewModelValidatorEmail();
      this.registerPropertyValidator(propertyKey, [val]);
     
    }
  }
}

function getPropertySetterValidatorPhone(propertyKey: string, callback?: string) {
  return function(this: IViewModel, newValue: unknown){
    
    setProperty(this, newValue, propertyKey, callback);
    if(this.hasPropertyValidator(propertyKey)) {
      this.validateProperty(propertyKey);
    } else {
      const val = new ViewModelValidatorPhone();
      this.registerPropertyValidator(propertyKey, [val]);
     
    }
  }
}

function getPropertySetterValidatorTrue(propertyKey: string, callback?: string) {
  return function(this: IViewModel, newValue: unknown){
    
    setProperty(this, newValue, propertyKey, callback);
    if(this.hasPropertyValidator(propertyKey)) {
      this.validateProperty(propertyKey);
    } else {
      const val = new ViewModelValidatorTrue();
      this.registerPropertyValidator(propertyKey, [val]);
     
    }
  }
}

function getPropertySetterValidatorInteger(propertyKey: string, callback?: string) {
    return function(this: IViewModel, newValue: unknown){
      
      setProperty(this, newValue, propertyKey, callback);
      if(this.hasPropertyValidator(propertyKey)) {
        this.validateProperty(propertyKey);
      } else {
        const val = new ViewModelValidatorInteger();
        this.registerPropertyValidator(propertyKey, [val]);
        this.validateProperty(propertyKey);
    
      }
    }
  }

/**
 * Rejestracja propertyChange
 * 
 * @param callback 
 * @returns 
 */
export function propChange(callback?: string){
  return function(target: object, propertyKey: string) {
      
      Object.defineProperty(target, propertyKey, {
        get: getPropertyGetter(propertyKey),
        set: getPropertySetter(propertyKey, callback)
      }); 

  }

}


/**
 * 
 * Rejestracja propertyChange po nazwie
 * 
 * @param propertyName 
 * @param callback 
 * @returns 
 */
export function propChangeName(propertyName: string, callback?: string){
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyName),
      set: getPropertySetter(propertyName, callback)
    });
  }
}

/**
 * 
 * Rejestracja property change Validator noEmpty
 * 
 * @param callback 
 * @returns 
 */
export function validatorNoEmpty(callback?: string){
  
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyKey),
      set: getPropertySetterValidatorNoEmpty(propertyKey, callback)
    });
  }
}

/**
 * 
 * Rejestracja property change Validator lenght
 * 
 * @param minLength 
 * @param maxLength 
 * @param callback 
 * @returns 
 */
export function validatorLenght(minLength: number, maxLength?: number, callback?: string){
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyKey),
      set: getPropertySetterValidatorLenght(propertyKey, minLength, maxLength, callback)
    });
  }
}

/**
 * 
 * rejestracja property change Validator Email
 * 
 * @param callback 
 * @returns 
 */
export function validatorEmail(callback?: string){
  
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyKey),
      set: getPropertySetterValidatorEmail(propertyKey, callback)
    });
  }
}

/**
 * 
 * Validacja telefonu
 * 
 * @param callback 
 * @returns 
 */
export function validatorPhone(callback?: string){
  
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyKey),
      set: getPropertySetterValidatorPhone(propertyKey, callback)
    });
  }
}


/**
 * 
 * Validacja true
 * 
 * @param callback 
 * @returns 
 */
export function validatorTrue(callback?: string){
  
  return function(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: getPropertyGetter(propertyKey),
      set: getPropertySetterValidatorTrue(propertyKey, callback)
    });
  }
}

/**
 * 
 * Validacja Integer
 * 
 * @param callback 
 * @returns 
 */
export function validatorInteger(callback?: string){
  
    return function(target: object, propertyKey: string) {
      Object.defineProperty(target, propertyKey, {
        get: getPropertyGetter(propertyKey),
        set: getPropertySetterValidatorInteger(propertyKey, callback)
      });
    }
  }