/* eslint-disable no-param-reassign */

const getHashCode = (s = '') => s.split('').reduce((a, b) => {
    // eslint-disable-next-line no-bitwise
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
}, 0);

const hash = (productId, digits) => {
    // eslint-disable-next-line no-restricted-properties
    const hashCode = ((Math.abs(getHashCode(productId)) % (Math.pow(10, digits) - 1)) + 1).toString();
    if (hashCode.length === 1) {
        return `0${hashCode}`;
    }
    return hashCode;
};

export default hash;