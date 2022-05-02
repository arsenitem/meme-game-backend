const addProxySet = (object: any, callback: Function) => {
    // const handler = {
    //     set(target: any, prop: any, val: any): boolean {
    //         target[prop] = val;
    //         callback();
    //         return true;
    //     }
    // }
    // return new Proxy(object, handler);

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

const addProxySetNested = (object: any, callback: Function) => {
    for(let prop in object) {
        if (typeof object[prop] === 'object' && object[prop] !== null) {
            object[prop] = addProxySetNested(object[prop], callback);
        }
    }

    return addProxySet(object, callback)
}

export {
    addProxySet,
    addProxySetNested
}