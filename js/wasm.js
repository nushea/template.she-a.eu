/**
 * @typedef {{}} WASMInstance
 * @typedef {(instance: WASMInstance) => void} WASMLoadCallback
 * @typedef {{ __instances?: [[WASMOptions, WASMInstance | null | [WASMLoadCallback]]] }} WASMData
 * @typedef {Record<string, any> | undefined} WASMOptions
 */
function onWASMLoad(
    /** @type {(() => Promise<WASMInstance>) & WASMData} */
    wasm,
    /** @type {LoadCallback} */
    callback,
    /** @type {WASMOptions} */
    options,
    /** @type {(a: WASMOptions, b: WASMOptions) => boolean} */
    optionsEqual = (a, b) => {
        if (a === b) return true;
        for (const bKey in b) {
            if (!(bKey in a)) return false;
        }
        for (const aKey in a) {
            if (!(aKey in b && Object.is(b[aKey], a[aKey]))) return false;
        }
        return true;
    }
) {
    if (wasm.__instances !== undefined) {
        for (const [instanceOptions, instanceOrCallbacks] of wasm.__instances) {
            if (!optionsEqual(instanceOptions, options)) {
                continue;
            }
            if (instanceOrCallbacks instanceof Array) {
                instanceOrCallbacks.push(callback);
            } else {
                setTimeout(() => callback(instanceOrCallbacks), 0);
            }
            return;
        }
    } else {
        wasm.__instances = [];
    }
    const loadCallbacks = [callback];
    const instanceData = [options, loadCallbacks];
    wasm.__instances.push(instanceData);
    const loaded = (instance) => {
        instanceData[1] = instance;
        for (const callback of loadCallbacks) {
            callback(instance);
        }
    };
    wasm(options).then(loaded, (error) => {
        console.error(`Couldn't load ${wasm.name}:`, error);
        loaded(null);
    });
}
