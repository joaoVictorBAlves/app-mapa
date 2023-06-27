function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const useProcessProperties = (data, propertyName, groupingOperation = 'mean') => {
    if (!data.hasOwnProperty(propertyName)) {
        throw new Error(`A propriedade '${propertyName}' não existe no objeto.`);
    }

    const propertyValue = data[propertyName];
    if (!Array.isArray(propertyValue)) {
        if (isNumeric(propertyValue)) {
            return parseFloat(propertyValue);
        } else {
            return propertyValue;
        }
    }

    const flattenedArray = propertyValue.flat();
    console.log(flattenedArray)
    if (flattenedArray.every(isNumeric)) {
        const numeric = flattenedArray.map(parseFloat);
        switch (groupingOperation) {
            case 'mean':
                return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
            case 'count':
                return numeric.length;
            case 'sum':
                return numeric.reduce((sum, value) => sum + value, 0);
            case 'mode':
                const countMap = new Map();
                numeric.forEach((value) => {
                    countMap.set(value, (countMap.get(value) || 0) + 1);
                });
                const mode = [...countMap.entries()].reduce(
                    (max, [value, count]) => (count > max.count ? { value, count } : max),
                    { value: null, count: 0 }
                );
                return mode.value;
            default:
                throw new Error(`Operação de agrupamento '${groupingOperation}' não suportada.`);
        }
    }

    const countMap = new Map();
    flattenedArray.forEach((value) => {
        countMap.set(value, (countMap.get(value) || 0) + 1);
    });
    const mode = [...countMap.entries()].reduce(
        (max, [value, count]) => (count > max.count ? { value, count } : max),
        { value: null, count: 0 }
    );
    return mode.value;
}

export default useProcessProperties;