const addProxySet = (object: any, callback: Function) => {
    var handler =  {
        get(obj: any, prop: any): any {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                return new Proxy(obj[prop], handler);
            }

            return obj[prop];
        },
        set(obj: any, prop: any, value: any): any  {
            obj[prop] = value;
            callback();
            return true;
        }
    };

    return new Proxy(object, handler)
}

const watchProp = (object: any, objectProp: string, callback: Function) => {
    var handler =  {
        get(obj: any, prop: any): any {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                return new Proxy(obj[prop], handler);
            }

            return obj[prop];
        },
        set(obj: any, prop: any, value: any): any  {
            obj[prop] = value;
            if (prop === objectProp) {
                callback();
            } 
            return true;
        }
    };

    return new Proxy(object, handler)
}

export {
    addProxySet,
    watchProp
}