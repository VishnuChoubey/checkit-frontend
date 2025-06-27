const parseLocation = (location) => {
    let {
        latitude,
        longitude
    } = location || {};
    if (latitude && typeof latitude === 'string') {
        latitude = parseFloat(latitude);
    }
    if (longitude && typeof longitude === 'string') {
        longitude = parseFloat(longitude);
    }
    return {
        latitude,
        longitude,
    };
};

const computeHeading = (lastLoc, currLoc) => {
    // eslint-disable-next-line no-param-reassign
    lastLoc = parseLocation(lastLoc);
    // eslint-disable-next-line no-param-reassign
    currLoc = parseLocation(currLoc);
    const {
        latitude: lat1,
        longitude: lng1
    } = lastLoc;
    const {
        latitude: lat2,
        longitude: lng2
    } = currLoc;
    const c = (lat1 * Math.PI) / 180;
    const d = (lng2 * Math.PI) / 180 - (lng1 * Math.PI) / 180;
    const e = (lat2 * Math.PI) / 180;
    const computedValue = Math.atan2(
        Math.sin(d) * Math.cos(e),
        Math.cos(c) * Math.sin(e) - Math.sin(c) * Math.cos(e) * Math.cos(d),
    );
    const a = (180 * computedValue) / Math.PI;
    const b1 = -180;
    let c1 = 180;
    c1 -= b1;
    return ((((a - b1) % c1) + c1) % c1) + b1;
};

// eslint-disable-next-line consistent-return
export const getRotation = (lastLoc, currLoc) => {
    const heading = computeHeading(lastLoc, currLoc);
    if (heading > 0.01 || heading < -0.01) {
        /* to ignore north facing image when difference of angle is 0 */
        return heading;
    }
};

export const getInBoundMarkers = (markers) => {
    const inBoundMarkers = [];
    if (markers) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            if (marker.inBounds) {
                inBoundMarkers.push(marker);
            }
        }
    }
    return inBoundMarkers;
};