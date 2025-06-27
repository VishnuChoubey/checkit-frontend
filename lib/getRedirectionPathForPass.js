import {
    generatePath
} from 'react-router';
import {
    ticketStatus,
    UiRoutes,
    actionRequiredForTicket,
    millisecondsInOneDay,
    bookingStatus,
} from './constants';
import qrSoundPlay from './qrSoundPlay';
import {
    getIsPassStartTimeReached,
    getIsExpired,
    getIsActivationWindowExpired,
    checkRouteUsingRemoteConfig,
    // checkPunchNotificationReceived,
} from './util';

const getRedirectionPathForPass = (ticketInfo, chaloTime, reclaimTime) => {
    const {
        status,
        actionRequired,
        productSubType = ''
    } = ticketInfo;
    // if (ticketInfo?.isTicket
    //    && ((ticketInfo?.rideCount
    //      && getIsActivationWindowExpired(ticketInfo, chaloTime))
    //      || ticketInfo?.isExpired)) {
    //   return generatePath(UiRoutes.summary, {
    //     transactionId: ticketInfo?.transactionId,
    //   });
    // }
    if (status === ticketStatus ? .failed || status === ticketStatus.pending ||
        status === ticketStatus ? .paymentFailed || status === ticketStatus ? .processing ||
        status === bookingStatus.USER_CANCELLED || status === bookingStatus.SYSTEM_CANCELLED ||
        status === bookingStatus.USER_RESCHEDULED || status === bookingStatus.SYSTEM_CANCELLED ||
        (status === bookingStatus.USED && ticketInfo ? .premiumReserveTicket)) {
        if (ticketInfo ? .instantTicket) {
            return generatePath(UiRoutes.summaryInstantTicket, {
                transactionId: ticketInfo ? .transactionId
            });
        }
        if (ticketInfo ? .premiumReserveTicket) {
            return generatePath(UiRoutes.premiumBusSummary, {
                transactionId: ticketInfo ? .transactionId
            });
        }
        return generatePath(UiRoutes.summary, {
            transactionId: ticketInfo ? .transactionId,
        });
    }
    if (status === ticketStatus ? .verified) {
        return generatePath(UiRoutes ? .purchasePassAfterVerification, {
            transactionId: ticketInfo ? .transactionId,
            isRenew: false
        });
    }
    if (status === ticketStatus ? .rejected && actionRequired === actionRequiredForTicket.reinitiate) {
        return generatePath(UiRoutes ? .verificationRejection, {
            transactionId: ticketInfo ? .transactionId,
        });
    }
    if (status === ticketStatus.rejected &&
        ticketInfo ? .actionRequired === actionRequiredForTicket.reapply) {
        return generatePath(UiRoutes ? .documentVerificationFailed, {
            transactionId: ticketInfo ? .transactionId
        });
    }
    if (status === ticketStatus.unverified) {
        return generatePath(UiRoutes ? .submitForVerificationSuccessful, {
            transactionId: ticketInfo ? .transactionId
        });
    }
    if (ticketInfo ? .numOfTrips !== -1 && ticketInfo ? .isHailingAllowed !== false) {
        if (productSubType === 'rideBasedPass' && !ticketInfo ? .isActivationAllowedInCurrentSession &&
            !getIsExpired(ticketInfo, chaloTime)) {
            const millisecondEllipse = chaloTime - (ticketInfo.oldestHistoryCallTimeStamp || 0);
            if (millisecondEllipse <= (reclaimTime || millisecondsInOneDay)) {
                return true;
            }
        }
    }
    if (getIsExpired(ticketInfo, chaloTime)) {
        if (ticketInfo ? .instantTicket) {
            return generatePath(UiRoutes.summaryInstantTicket, {
                transactionId: ticketInfo ? .transactionId
            });
        }
    }
    if (!getIsExpired(ticketInfo, chaloTime)) {
        if (!ticketInfo ? .isExpired) {
            if (!getIsPassStartTimeReached(ticketInfo, chaloTime) && !ticketInfo ? .isTicket) {
                if (ticketInfo ? .premiumReserveTicket) {
                    return generatePath(UiRoutes.premiumBusSummary, {
                        transactionId: ticketInfo ? .transactionId
                    });
                }
                return generatePath(UiRoutes.summary, {
                    transactionId: ticketInfo ? .transactionId,
                });
            }
            // if (checkPunchNotificationReceived(ticketInfo, chaloTime)) {
            //   if (ticketInfo?.premiumReserveTicket) {
            //     return generatePath(UiRoutes.premiumBusBeforeActivation, {
            //       transactionId: ticketInfo?.transactionId,
            //     });
            //   }
            //   return generatePath(UiRoutes.beforeActivation, {
            //     transactionId: ticketInfo?.transactionId,
            //   });
            // }
            if (getIsActivationWindowExpired(ticketInfo, chaloTime) || !ticketInfo ? .isRidePresent) {
                if (!ticketInfo ? .isPassActivatedVisited) {
                    if (ticketInfo ? .premiumReserveTicket) {
                        return generatePath(UiRoutes.premiumBusBeforeActivation, {
                            transactionId: ticketInfo ? .transactionId,
                        });
                    }
                    return generatePath(UiRoutes.beforeActivation, {
                        transactionId: ticketInfo ? .transactionId,
                    });
                }
                if (!ticketInfo ? .isContactLessValidationVisited) {
                    if (ticketInfo ? .premiumReserveTicket) {
                        return generatePath(UiRoutes.premiumBusBeforeActivation, {
                            transactionId: ticketInfo ? .transactionId,
                        });
                    }
                    qrSoundPlay(ticketInfo);
                    return generatePath(UiRoutes.soundQR, {
                        transactionId: ticketInfo ? .transactionId,
                    });
                }
                if (ticketInfo ? .premiumReserveTicket) {
                    return generatePath(UiRoutes.premiumBusBeforeActivation, {
                        transactionId: ticketInfo ? .transactionId,
                    });
                }
                return generatePath(UiRoutes.beforeActivation, {
                    transactionId: ticketInfo ? .transactionId,
                });
            }
            if (checkRouteUsingRemoteConfig(ticketInfo ? .city)) {
                return generatePath(UiRoutes.passValidation, {
                    transactionId: ticketInfo ? .transactionId,
                });
            }
            if (ticketInfo ? .premiumReserveTicket) {
                return generatePath(UiRoutes.premiumBusBeforeActivation, {
                    transactionId: ticketInfo ? .transactionId,
                });
            }
            qrSoundPlay(ticketInfo);
            return generatePath(UiRoutes.soundQR, {
                transactionId: ticketInfo ? .transactionId,
            });
        }
        // if (status === ticketStatus?.success) {
        //   qrSoundPlay(ticketInfo);
        //   return generatePath(UiRoutes.soundQR, {
        //     transactionId: ticketInfo?.transactionId,
        //   });
        // }
    }
    if (ticketInfo ? .premiumReserveTicket) {
        return generatePath(UiRoutes.premiumBusSummary, {
            transactionId: ticketInfo ? .transactionId
        });
    }
    return generatePath(UiRoutes.summary, {
        transactionId: ticketInfo ? .transactionId,
    });
};

export default getRedirectionPathForPass;