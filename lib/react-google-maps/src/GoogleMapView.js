/* eslint-disable consistent-return */
/* eslint-disable react/no-deprecated */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable no-void */
/* eslint-disable no-return-assign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable react/state-in-constructor */
// eslint-disable-next-line import/no-extraneous-dependencies
import React, {
    Component
} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';
import {
    getDate
} from '../../util';
import {
    MarkerAnimation
} from './MarkerAnimation';
import {
    getInBoundMarkers
} from './Utility';

let google;
let geocoder;
let zoomChangeListener;
let centerChange;
let dragListener;
let circleClickListener;
let mapClickListener;
let mapDragListerner;
let boundChangeListener;

export default class ReactMapView extends Component {
    state = {};

    mapId = uuid();

    infowindow = void 0

    fitInBounds = 0

    getMap = () => this.state.map;

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
        google = window.google;
        if (!google) {
            return;
        }
        this.infowindow = new google.maps.InfoWindow();
        MarkerAnimation(google);
        geocoder = new google.maps.Geocoder();
        const map = this.createMap();
        this.setState({
                map,
            },
            () => {
                const {
                    markers,
                    polyline,
                    inBoundFirst,
                    boundCoordinates,
                } = this.props;
                this.addMapMarkers(markers);
                this.setPolylineInMap(polyline);
                if (inBoundFirst) {
                    if (boundCoordinates && boundCoordinates.length) {
                        this.timer = setTimeout(() => {
                            this.fitMarkersInBounds(boundCoordinates);
                        }, 1000);
                    } else {
                        const inBoundMarkers = getInBoundMarkers(markers);
                        if (inBoundMarkers && inBoundMarkers.length) {
                            this.timer = setTimeout(() => {
                                this.fitMarkersInBounds(inBoundMarkers);
                            }, 1000);
                        }
                    }
                }
            },
        );

        function successCallback(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const userLocation = new google.maps.LatLng(userLat, userLng);

            // Create a marker for the user's location
            // eslint-disable-next-line no-unused-vars
            const userMarker = new google.maps.Marker({
                position: userLocation,
                map,
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue dot icon
                    scaledSize: new google.maps.Size(24, 24), // Size of the icon
                },
                title: 'Your Location',
            });
        }

        function errorCallback(error) {
            // Handle errors, e.g., permission denied or no location available
            console.error('Error getting user location:', error);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    componentWillUnmount() {
        if (google) {
            google.maps.event.removeListener(zoomChangeListener);
            google.maps.event.removeListener(centerChange);
            google.maps.event.removeListener(dragListener);
            google.maps.event.removeListener(boundChangeListener);
            google.maps.event.removeListener(circleClickListener);
            google.maps.event.removeListener(mapClickListener);
            google.maps.event.removeListener(mapDragListerner);
        }
    }

    createMap = () => {
        const {
            zoom = 3,
                minZoom = 3,
                maxZoom = 18,
                defaultLocation: {
                    latitude = 0,
                    longitude = 0
                } = {},
                mapType = 'standard',
                options,
                createCircleOptions,
                onBoundsChanged = () => {},
                zoomControl,
                gestureHandling,
                showCircle = false,
        } = this.props;
        const mapOptions = {
            mapTypeId: mapType === 'standard' ? 'roadmap' : mapType,
            zoom,
            maxZoom,
            minZoom,
            gestureHandling,
            zoomControl,
            center: this.getLatlng(latitude, longitude),
            styles: [{
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#d1d8dd'
                }]
            }, {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#688695'
                }]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [{
                    weight: 3
                }]
            }, {
                featureType: 'landscape',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#d1d8dd'
                }]
            }, {
                featureType: 'landscape',
                elementType: 'geometry.stroke',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'landscape.man_made',
                elementType: 'geometry.fill',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'landscape.man_made',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#bbbbbb'
                }, {
                    visibility: 'on'
                }, {
                    weight: 0.5
                }]
            }, {
                featureType: 'landscape.natural.landcover',
                elementType: 'geometry.fill',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'poi.business',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#000000'
                }, {
                    visibility: 'off'
                }, {
                    weight: 0.5
                }]
            }, {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#b3e08d'
                }]
            }, {
                featureType: 'poi.sports_complex',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#b3e08d'
                }]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#ffffff'
                }]
            }, {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#f0f0f0'
                }]
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#ffffff'
                }, {
                    weight: 0.5
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#f8f8f8'
                }]
            }, {
                featureType: 'road.highway',
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{
                    color: '#a7a7a7'
                }, {
                    weight: 0.5
                }]
            }, {
                featureType: 'transit.station.airport',
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'transit.station.bus',
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'transit.station.rail',
                elementType: 'labels.icon',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{
                    color: '#9ec2e1'
                }]
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#757575'
                }]
            }],
            clickableIcons: false,
            ...options,
        };
        const mapDiv = document.getElementById(this.mapId);
        const map = new google.maps.Map(mapDiv, mapOptions);
        map.addListener('dblclick', () => {
            this.dblclick = true;
            setTimeout(() => (this.dblclick = false), 100);
        });
        map.addListener('click', () => {
            this.infowindow && this.infowindow.close();
        });
        mapDiv.addEventListener('mousedown', (event) => {
            let rightClick = void 0;
            if (event.which === 3) {
                rightClick = true;
            } else {
                // Internet Explorer before version 9
                if (event.button === 2) {
                    rightClick = true;
                }
            }
            if (rightClick) {
                const double = this.lastPress && getDate().getTime() - this.lastPress;
                if (double && double < 500) {
                    this.dblclick = true;
                }
                this.lastPress = this.dblclick ? void 0 : getDate().getTime();
            }
        });
        const circleOptions = ({ ...createCircleOptions,
            map
        });

        let cityCircle;
        if (showCircle) {
            cityCircle = new google.maps.Circle(circleOptions);
        }
        dragListener = map.addListener('drag', () => {
            this.dragging = true;
        });
        cityCircle ? .setCenter(map.getCenter());

        centerChange = map.addListener('center_changed', () => {
            onBoundsChanged(map.getCenter());
            cityCircle ? .setCenter(map.getCenter());
        });

        circleClickListener = cityCircle ? .addListener('click', () => {
            this.props ? .onMapClick ? .();
        });

        mapClickListener = map.addListener('click', () => {
            this.props ? .onMapClick ? .();
        });

        mapDragListerner = google.maps.event.addListener(map, 'drag', () => {
            onBoundsChanged(map.getCenter());
            cityCircle ? .setCenter(map.getCenter());
        });

        boundChangeListener = map.addListener('bounds_changed', () => {
            this.bounds_changed = true;
            this.regionChange();
        });

        zoomChangeListener = map.addListener('zoom_changed', () => {
            onBoundsChanged(map.getCenter());
            this.zoom_changed = true;
            this.regionChange();
        });

        // if (mapDiv.addEventListener) {
        //   // Internet Explorer, Opera, Google Chrome and Safari
        //   mapDiv.addEventListener("mousewheel", this.isScrollWheel);
        //   // Firefox
        //   mapDiv.addEventListener("DOMMouseScroll", this.isScrollWheel);
        //   mapDiv.addEventListener("MozMousePixelScroll", this.isScrollWheel);
        // } else if (mapDiv.attachEvent) {
        //   // IE before version 9
        //   mapDiv.attachEvent("onmousewheel", this.isScrollWheel);
        // }
        return map;
    };

    // isScrollWheel = () => {
    //   this.scrollWheel = true;
    // };

    regionChange = () => {
        const {
            onRegionChangeByUser
        } = this.props;
        if (
            (this.scrollWheel || this.dragging || this.dblclick || this.rightclick) &&
            (this.zoom_changed || this.bounds_changed)
        ) {
            onRegionChangeByUser && onRegionChangeByUser();
        }

        this.scrollWheel = false;
        this.dragging = false;
        this.dblclick = false;
        this.rightclick = false;
        this.zoom_changed = false;
        this.bounds_changed = false;
    };

    removePreviousPolyline = () => {
        this.polyline &&
            this.polyline.forEach((prevPolyline) => {
                prevPolyline && prevPolyline.setMap && prevPolyline.setMap(null);
            });
        this.polyline = [];
    };

    setPolylineInMap = (polyline) => {
        const {
            map
        } = this.state;
        this.removePreviousPolyline();
        if (!map || !polyline || (Array.isArray(polyline) && !polyline.length)) {
            return;
        }
        if (!Array.isArray(polyline)) {
            polyline = [polyline];
        }
        polyline.forEach((_polyline) => {
            const {
                strokeWeight = 1,
                    strokeColor = '#F00',
                    strokeOpacity = 1.0,
                    polylineProps,
                    path,
            } = _polyline;
            if (path && path.length > 1) {
                const polylinePath = [];
                for (let i = 0; i < path.length; i++) {
                    const {
                        latitude,
                        longitude
                    } = path[i];
                    polylinePath.push(this.getLatlng(latitude, longitude));
                }
                const mapPolyline = new google.maps.Polyline({
                    path: polylinePath,
                    strokeColor: polylineProps ? .strokeColor || strokeColor,
                    strokeWeight: polylineProps ? .strokeWeight || strokeWeight,
                    strokeOpacity: polylineProps ? .strokeOpacity || strokeOpacity,
                    map,
                });
                this.polyline = this.polyline || [];
                this.polyline.push(mapPolyline);
            }
        });
    };

    fitMarkersInBounds = (markersArray) => {
        if (!markersArray || !markersArray.length) {
            return;
        }
        const bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < markersArray.length; i++) {
            const _marker = markersArray[i];
            const myLatLng = _marker.getPosition ?
                _marker.getPosition() :
                this.getLatlng(_marker.latitude, _marker.longitude);
            bounds.extend(myLatLng);
        }
        this.fitBounds(bounds);
        this.fitInBounds = 1;
    };

    getLatlng = (lat, lng) => new google.maps.LatLng(lat, lng);

    addMapMarkers = (markers = []) => {
        markers.forEach((marker) => {
            this.addMarker(marker);
        });
    };

    addMarker = (markerInfo) => {
        let infowindow = '';
        const _image = markerInfo.svgImage || markerInfo.image;
        if (_image && Array.isArray(_image)) {
            for (const i in _image) {
                const imageValue = _image[i];
                const _markerInfo = { ...markerInfo
                };
                _markerInfo.id = `${markerInfo.id}__${i}`;
                if (markerInfo.svgImage) {
                    _markerInfo.svgImage = imageValue;
                } else {
                    _markerInfo.image = imageValue;
                }
                this.addMarker(_markerInfo);
            }
            return;
        }
        const {
            map
        } = this.state;

        if (markerInfo.renderContent) {
            infowindow = new google.maps.InfoWindow({
                content: markerInfo.renderContent,
                maxWidth: 50,
                disableAutoPan: true,
            });
        }

        this.markersObject = this.markersObject || {};
        let _markerToUpdate = this.markersObject[markerInfo.id];
        if (_markerToUpdate) {
            /* for updating more properties of marker if updated from user */
            Object.assign(_markerToUpdate, markerInfo);
            this.updateMarker(this.markersObject[markerInfo.id], markerInfo);
        } else {
            /* this function is called in recursion if svgImage or image is appeared to be array */

            _markerToUpdate = new google.maps.Marker({
                position: this.getLatlng(markerInfo.latitude, markerInfo.longitude),
                title: markerInfo.title,
                id: markerInfo.id,
                draggable: markerInfo.draggable,
                inBounds: markerInfo.inBounds,
                map,
                zIndex: markerInfo.zIndex,
                opacity: markerInfo.opacity,
            });
            this.markersObject[markerInfo.id] = _markerToUpdate;
            if (markerInfo.renderContent) {
                this.props.showTitleMarkers && infowindow.open(map, _markerToUpdate);
            }
        }
        google.maps.event.addListener(_markerToUpdate, 'click', (e) => {
            markerInfo ? .handleBottomSheet ? .(e.latLng);
            this.props ? .onMapClick ? .();
        }, {
            once: true,
        });
        this.setIcon(_markerToUpdate, markerInfo, map.getZoom());
        if (!markerInfo.renderContent) {
            this.updateInfoWindow(_markerToUpdate, markerInfo);
        }
    };

    getImage = (image, scale, anchor) => {
        const icon = {
            url: `${image}`,
            origin: new google.maps.Point(0, 0),
        };
        if (scale) {
            icon.scaledSize = new google.maps.Size(scale.w, scale.h);
        }
        if (anchor) {
            icon.anchor = new google.maps.Point(anchor.w, anchor.h);
        }
        return icon;
    };

    fitBounds = (bounds) => {
        const {
            map
        } = this.state;
        map.fitBounds(bounds);
        map.panBy(0, 0);
        this.setState({
            map
        });
    };

    checkAndFitMarkersInBounds = (markers) => {
        if (!markers || !markers.length) {
            return;
        }
        let fitInBound = false;
        for (let i = 0; i < markers.length; i++) {
            const _marker = markers[i];
            /* If current marker updates goes out of bound then all markers are set within bounds */
            if (!this.checkIsInBounds(_marker)) {
                fitInBound = true;
                break;
            }
        }
        if (fitInBound) {
            this.fitMarkersInBounds(markers);
        }
    };

    /*
     *InfoWindow needs to update when location is reselected by
      user from GooglePlaceBox - Rohit Garg - 19 May, 2018
     * */
    updateInfoWindow = (marker, markerInfo) => {
        const {
            map
        } = this.state;
        const {
            showInfoWindow,
            infoWindow,
            onPress,
            onCloseInfoWindow,
            busInfoWindow,
            onClickHandlersMarkerInfoWindow,
        } = markerInfo;
        if (infoWindow !== undefined) {
            if (marker.infowindow) {
                this.infowindow = marker.infowindow;
            } else {
                // this.infowindow = new google.maps.InfoWindow();
                marker.infowindow = this.infowindow;
                if (showInfoWindow) {
                    this.infowindow.open(map, marker);
                    google.maps.event.addListener(this.infowindow, 'closeclick', () => {
                        onCloseInfoWindow && onCloseInfoWindow();
                    });
                }
                if (markerInfo.isSelected) {
                    onPress && onPress();
                    this.setState({
                        selectedMarkerId: marker.id
                    });
                    if (this.infowindow.getMap() !== null && showInfoWindow) {
                        this.infowindow && this.infowindow.close();
                    }
                    this.infowindow.setContent(marker.infoWindow);
                    this.infowindow.setZIndex(10);
                    this.infowindow.open(map, marker);
                    map.panTo(marker.getPosition());
                    google.maps.event.addListener(this.infowindow, 'closeclick', () => {
                        onCloseInfoWindow && onCloseInfoWindow();
                    });
                    google.maps.event.addListener(this.infowindow, 'domready', () => {
                        const SeeMoreBusesButton = document.getElementById('chalo-info-window-button-see-more');
                        if (
                            onClickHandlersMarkerInfoWindow ? .handleOnClickSeeMoreBuses &&
                            SeeMoreBusesButton
                        ) {
                            SeeMoreBusesButton.onclick = onClickHandlersMarkerInfoWindow ?
                                .handleOnClickSeeMoreBuses;
                        }
                        const ViewTimeTableButton = document.getElementById('chalo-info-window-button-view-timetable');
                        if (
                            onClickHandlersMarkerInfoWindow ? .handleOnClickViewTimeTable &&
                            ViewTimeTableButton
                        ) {
                            ViewTimeTableButton.onclick = onClickHandlersMarkerInfoWindow ?
                                .handleOnClickViewTimeTable;
                        }
                    });
                }
                google.maps.event.addListener(marker, 'click', () => {
                    onPress && onPress();
                    this.setState({
                        selectedMarkerId: marker.id
                    });
                    if (this.infowindow.getMap() !== null && showInfoWindow) {
                        this.infowindow && this.infowindow.close();
                    }
                    this.infowindow.setContent(marker.infoWindow);
                    this.infowindow.setZIndex(10);
                    this.infowindow.open(map, marker);
                    map.panTo(marker.getPosition());
                    google.maps.event.addListener(this.infowindow, 'closeclick', () => {
                        onCloseInfoWindow && onCloseInfoWindow();
                    });
                    google.maps.event.addListener(this.infowindow, 'domready', () => {
                        const SeeMoreBusesButton = document.getElementById('chalo-info-window-button-see-more');
                        if (
                            onClickHandlersMarkerInfoWindow ? .handleOnClickSeeMoreBuses &&
                            SeeMoreBusesButton
                        ) {
                            SeeMoreBusesButton.onclick = onClickHandlersMarkerInfoWindow ?
                                .handleOnClickSeeMoreBuses;
                        }
                        const ViewTimeTableButton = document.getElementById('chalo-info-window-button-view-timetable');
                        if (
                            onClickHandlersMarkerInfoWindow ? .handleOnClickViewTimeTable &&
                            ViewTimeTableButton
                        ) {
                            ViewTimeTableButton.onclick = onClickHandlersMarkerInfoWindow ?
                                .handleOnClickViewTimeTable;
                        }
                    });
                });
            }
            if (this.state.selectedMarkerId === marker.id) {
                this.infowindow.setContent(infoWindow);
                this.infowindow.setZIndex(10);
            }
        }
        if (busInfoWindow !== undefined) {
            let businfowindow = void 0;
            if (marker.infowindow) {
                businfowindow = marker.infowindow;
            } else {
                businfowindow = new google.maps.InfoWindow({
                    disableAutoPan: true,
                    zIndex: 5
                });
                marker.infowindow = businfowindow;
                if (showInfoWindow) {
                    businfowindow.open(map, marker);
                    google.maps.event.addListener(businfowindow, 'closeclick', () => {
                        onCloseInfoWindow && onCloseInfoWindow();
                    });
                }
            }
            if (showInfoWindow) {
                businfowindow.setContent(busInfoWindow);
                businfowindow.open(map, marker);
                // businfowindow.setZIndex(5);
            } else {
                marker.infowindow && marker.infowindow.close();
            }
        }
        if (markerInfo.draggable) {
            this.infowindow && this.infowindow.open(map, marker);
            google.maps.event.addListener(marker, 'dragend', (event) => {
                this.infowindow && this.infowindow.close();
                this.props.onChangeLocation &&
                    this.props.onChangeLocation(event.latLng, geocoder);
                map.panTo(marker.getPosition());
            });
        }
    };

    setIcon = (marker, markerInfo, zoom) => {
        let image = '';
        if (markerInfo.multipleImage && zoom < 15) {
            image = markerInfo ? .secondaryImage;
        } else {
            image = markerInfo.svgImage || markerInfo.image;
        }
        if (!image) {
            return;
        }
        if (typeof image === 'object') {
            // svg image case
            // const markerIcon = marker.icon;
            // if (!markerIcon) {

            // image.anchor = new google.maps.Point(400, 200);
            if (markerInfo && markerInfo.anchor) {
                image.anchor = new google.maps.Point(markerInfo.anchor.w, markerInfo.anchor.h);
            }
            if (markerInfo && markerInfo.scale) {
                image.scaledSize = new google.maps.Size(markerInfo.scale.w, markerInfo.scale.h);
            }
            marker.setIcon(image);
            // }
            // else if (
            //   (markerInfo.rotation && markerIcon.rotation !== markerInfo.rotation)
            //   || markerIcon.fillColor !== image.fillColor
            // ) {
            //   markerIcon.fillColor = image.fillColor;
            //   if (markerInfo.rotation) {
            //     markerIcon.rotation = markerInfo.rotation;
            //   }
            //   marker.setIcon(markerIcon);
            // }
        } else {
            this.props.showTitleMarkers ? marker.setIcon('p') :
                marker.setIcon(this.getImage(image, markerInfo.scale, markerInfo.anchor));
        }
    };

    /* by default we have added animation to all markers on moving */
    updateMarker = (marker, markerInfo) => {
        const {
            animation = true
        } = this.props;
        if (markerInfo.latitude && markerInfo.longitude) {
            const latlng = this.getLatlng(markerInfo.latitude, markerInfo.longitude);
            if (animation && marker.animateTo) {
                marker.animateTo(latlng, animation);
            } else {
                marker.setPosition(latlng);
            }
        }
        if (markerInfo.inBounds !== marker.inBounds) {
            marker.inBounds = markerInfo.inBounds;
        }
    };

    checkIsInBounds = (marker) => {
        if (marker && marker.inBounds) {
            const {
                map
            } = this.state;
            return map.getBounds() && map.getBounds().contains(marker.getPosition());
        }
    };

    updateMapType = (mapType) => {
        const {
            map
        } = this.state;
        map && map.setMapTypeId(mapType);
    };

    removeMarkers = (markers) => {
        if (this.markersObject) {
            /*
             * Required for delete marker case
             * */
            const idsToExist = markers.map((m) => m.id);
            for (const id in this.markersObject) {
                if (idsToExist.indexOf(id) === -1) {
                    const _marker = this.markersObject[id];
                    delete this.markersObject[id];
                    _marker && _marker.setMap(null);
                }
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        if (!google || !this.state.map) {
            return;
        }
        const {
            markers = [], fitInBound, mapType, polyline, boundCoordinates,
        } = nextProps;
        this.removeMarkers(markers);
        this.addMapMarkers(markers);
        const inBoundMarkers = getInBoundMarkers(markers);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (boundCoordinates && boundCoordinates.length && this.fitInBounds === 0) {
            this.timer = setTimeout(() => {
                this.fitMarkersInBounds(boundCoordinates);
            }, 500);
        } else if (inBoundMarkers && inBoundMarkers.length && this.fitInBounds === 0) {
            this.timer = setTimeout(() => {
                this.fitMarkersInBounds(inBoundMarkers);
            }, 500);
        }
        if (fitInBound) {
            this.fitMarkersInBounds(inBoundMarkers);
        } else {
            // this.checkAndFitMarkersInBounds(
            //   inBoundMarkers.map((marker) => this.markersObject[marker.id]),
            // );
        }
        this.setPolylineInMap(polyline);
        if (mapType !== this.props.mapType) {
            this.updateMapType(mapType === 'standard' ? 'roadmap' : mapType);
        }
    }

    render() {
        const {
            mapLayoutStyle
        } = this.props;
        return ( <
            div style = {
                {
                    flex: 1,
                    ...mapLayoutStyle,
                }
            }
            id = {
                this.mapId
            }
            />
        );
    }
}