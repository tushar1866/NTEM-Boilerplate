const pick = (object: Object, keys: string[]): { [key: string]: any } => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            (obj as any)[key] = (object as any)[key];
        }
        return obj;
    }, {});
};

export default pick;
