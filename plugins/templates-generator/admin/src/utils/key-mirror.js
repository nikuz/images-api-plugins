
export default function keyMirror(prefix = '', data) {
    const result = {};
    let collection = [];
    if (Array.isArray(data)) {
        collection = data;
    } else if (data instanceof Object) {
        collection = Object.keys(data);
    }

    collection.forEach((item) => {
        result[item] = `${prefix}/${item}`;
    });

    return result;
}
