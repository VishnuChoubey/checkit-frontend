/* eslint-disable no-continue */
/* eslint-disable prefer-const */
/* eslint-disable no-void */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-deprecated */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import GoogleMapView from './GoogleMapView';
import ErrorComponent from './ErrorComponent';
import {
    getRotation
} from './Utility';

export default class GoogleMap extends React.Component {
    componentWillMount() {
        const {
            markers
        } = this.props;
        this.validateMarkers(markers);
    }

    /* to check whether all markers have id or not */
    validateMarkers = (markers) => {
        if (markers) {
            for (let i = 0; i < markers.length; i++) {
                if (!markers[i].id) {
                    this.errorMarker = markers[i];
                    break;
                }
            }
        }
    };

    getMarkerPrevInfo = (currentMarkerId, currentMarkerIndex, prevMarkers) => {
        if (!prevMarkers || !prevMarkers.length) {
            return;
        }
        const indexMarker = prevMarkers[currentMarkerIndex];
        if (indexMarker && indexMarker.id === currentMarkerId) {
            return indexMarker;
        }
        for (let i = 0; i < prevMarkers.length; i++) {
            if (prevMarkers[i].id === currentMarkerId) {
                return prevMarkers[i];
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        const {
            markers
        } = this.props;
        const {
            markers: nextPropsMarkers
        } = nextProps;
        this.errorMarker = void 0;
        if (nextPropsMarkers) {
            for (let i = 0; i < nextPropsMarkers.length; i++) {
                const nextPropMarker = nextPropsMarkers[i];
                let {
                    latitude: nextMarkerLat,
                    longitude: nextMarkerLng,
                    id: nextMarkerId,
                    rotation,
                } = nextPropMarker;
                if (!nextMarkerId) {
                    this.errorMarker = nextPropMarker;
                    break;
                }
                const prevMarkerInfo = this.getMarkerPrevInfo(nextMarkerId, i, markers);
                if (!prevMarkerInfo) {
                    continue;
                }
                const {
                    latitude,
                    longitude
                } = prevMarkerInfo;
                if (latitude !== nextMarkerLat || longitude !== nextMarkerLng) {
                    /* if rotation is coming from user then compute heading is ignored */
                    if (rotation === undefined) {
                        rotation = getRotation(prevMarkerInfo, nextPropMarker);
                        if (rotation !== undefined) {
                            nextPropsMarkers[i].rotation = rotation;
                        }
                    }
                } else {
                    nextPropsMarkers[i] = {
                        ...prevMarkerInfo,
                        ...nextPropMarker,
                    };
                }
            }
        }
    }

    render() {
        let {
            defaultLocation,
            markers,
            bussesAroundYou
        } = this.props;
        if (this.errorMarker) {
            return ( <
                ErrorComponent errorMarker = {
                    this.errorMarker
                }
                markers = {
                    markers
                }
                />
            );
        }
        /* default Location is mandatory to show initial map position */
        if (!bussesAroundYou) {
            defaultLocation = markers &&
                markers.length ? markers[0] : defaultLocation;
        }
        return ( <
            GoogleMapView { ...this.props
            }
            defaultLocation = {
                defaultLocation
            }
            />
        );
    }
}