/* eslint-disable max-len */

function getAngle(data) {
    const {
        point,
        polylineData,
        firstStop,
        lastStop,
    } = data;
    if (!point && !polylineData) {
        return 0;
    }
    let angle = 0;
    polylineData.unshift({
        latitude: firstStop ? .stop_lat,
        longitude: firstStop ? .stop_lon,
    });
    polylineData.push({
        latitude: lastStop ? .stop_lat,
        longitude: lastStop ? .stop_lon,
    });
    try {
        let index = polylineData.length - 1;
        let minDistance = Number.MAX_VALUE;
        for (let i = 0; i < polylineData.length; i += 1) {
            const point1LatLng = new window.google.maps.LatLng(point.latitude, point.longitude);
            const point2LatLng = new window.google.maps.LatLng(polylineData[i].latitude, polylineData[i].longitude);
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(point1LatLng, point2LatLng);
            if (distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }
        index = index < polylineData.length - 1 ? index + 1 : polylineData.length - 1;
        if (index < polylineData.length - 1) {
            const point1LatLng = new window.google.maps.LatLng(point.latitude, point.longitude);
            const point2LatLng = new window.google.maps.LatLng(polylineData[index].latitude, polylineData[index].longitude);
            angle = window.google.maps.geometry.spherical.computeHeading(point1LatLng, point2LatLng);
        }
    } catch (e) {
        // do nothing
    }
    return angle;
}

export default getAngle;