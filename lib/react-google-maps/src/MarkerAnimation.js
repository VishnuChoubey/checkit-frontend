// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import {
    getDate
} from '../../util';

// eslint-disable-next-line import/prefer-default-export
export const MarkerAnimation = (google) => {
    // eslint-disable-next-line no-param-reassign
    google.maps.Marker.prototype.animateTo = function animateTo(newPosition, options = {}) {
        // eslint-disable-next-line no-param-reassign
        options = {
            easing: 'linear',
            ...options,
        };
        if (options.easing !== 'linear') {
            if (typeof jQuery === 'undefined' || !jQuery.easing[options.easing]) {
                return;
            }
        }
        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
        this.AT_startPosition_lat = this.getPosition().lat();
        this.AT_startPosition_lng = this.getPosition().lng();
        const newPositionLat = newPosition.lat();
        let newPositionLng = newPosition.lng();
        // crossing the 180° meridian and going the long way around the earth?
        if (Math.abs(newPositionLng - this.AT_startPosition_lng) > 180) {
            if (newPositionLng > this.AT_startPosition_lng) {
                newPositionLng -= 360;
            } else {
                newPositionLng += 360;
            }
        }
        const animateStep = function animateStep(marker, startTime) {
            const ellapsedTime = getDate().getTime() - startTime;
            const duration = options.duration || 1000;
            const durationRatio = ellapsedTime / duration; // 0 - 1
            let easingDurationRatio = durationRatio;
            // use jQuery easing if it's not linear
            if (options.easing !== 'linear') {
                easingDurationRatio = jQuery.easing[options.easing](
                    durationRatio,
                    ellapsedTime,
                    0,
                    1,
                    duration,
                );
            }
            if (durationRatio < 1) {
                const deltaPosition = new google.maps.LatLng(
                    marker.AT_startPosition_lat +
                    (newPositionLat - marker.AT_startPosition_lat) *
                    easingDurationRatio,
                    marker.AT_startPosition_lng +
                    (newPositionLng - marker.AT_startPosition_lng) *
                    easingDurationRatio,
                );
                marker.setPosition(deltaPosition);
                if (window.requestAnimationFrame) {
                    // eslint-disable-next-line no-param-reassign
                    marker.AT_animationHandler = window.requestAnimationFrame(() => {
                        animateStep(marker, startTime);
                    });
                } else {
                    // eslint-disable-next-line no-param-reassign
                    marker.AT_animationHandler = setTimeout(() => {
                        animateStep(marker, startTime);
                    }, 17);
                }
            } else {
                marker.setPosition(newPosition);
                if (options.complete && typeof options.complete === 'function') {
                    options.complete();
                }
            }
        };
        // stop possibly running animation
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(this.AT_animationHandler);
        } else {
            clearTimeout(this.AT_animationHandler);
        }
        animateStep(this, getDate().getTime());
    };
};