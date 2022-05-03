const isObject = (obj: any) => {
    return typeof obj === 'object';
}

const addProxySet = (object: any, callback: Function, objectProperty: string = '') => {
    var handler =  {
        get(obj: any, prop: any): any {
            if (isObject(obj[prop]) && obj[prop] !== null) {
                return new Proxy(obj[prop], handler);
            }

            return obj[prop];
        },
        set(obj: any, prop: any, value: any): any  {
            obj[prop] = value;
            if (objectProperty) {
                callback();
                return true;
            }
            
            callback();
            return true;
            
        }
    };

    return new Proxy(object, handler)
}

export {
    addProxySet,
}