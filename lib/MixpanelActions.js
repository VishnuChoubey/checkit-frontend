/* eslint-disable max-classes-per-file */
import Mixpanel from './Mixpanel';
import {
    mixpanelEvent
} from './constants';
import {
    getDate,
    getTimestamp
} from './util';

function getTimeZone() {
    const offset = getDate().getTimezoneOffset();
    const o = Math.abs(offset);
    return `${(offset < 0 ? '+' : '-') + (`00${Math.floor(o / 60)}`).slice(-2)}:${(`00${o % 60}`).slice(-2)}`;
}
class _SetSuperAndProfileProperities {
    constructor() {
        this.defaultSuperProperties = {
            clientSource: 'PWA'
        };
        this.commonProperties = {
            appVersionCode: process.env.REACT_APP_VERSION,
            'selected language': 'English',
            timeZone: getTimeZone(),
        };
    }

    setSuperProperties = (superProperties = {}) => {
        Mixpanel.setSuperProperties({
            ...this.defaultSuperProperties,
            ...this.commonProperties,
            ...superProperties,
        });
    }

    removeSuperProperties = () => {
        Mixpanel.removeSuperProperties('clientSource');
    }

    setProfileProperities = (id, profileProperties) => {
        Mixpanel.set(id, {
            ...this.commonProperties,
            ...profileProperties,
        });
    }

    reset = () => {
        Mixpanel.reset();
    }

    identifyUser = (id) => {
        Mixpanel.identify(id);
    }
}
class _logEvent {
    appOpen = () => {
        Mixpanel.track(mixpanelEvent.appOpen, {

        });
    }

    chaloTimeFetch = (serverTime) => {
        const anchorTime = getTimestamp();
        const delta = getTimestamp() - anchorTime;
        const chaloTime = getTimestamp() - anchorTime + serverTime;
        Mixpanel.track(mixpanelEvent.chaloTimefetched, {
            anchorTime,
            serverTime,
            delta,
            chaloTime,
        });
    }

    routeScreenOpened = (params) => {
        Mixpanel.track(mixpanelEvent.routeScreenOpened, {
            ...params,
        });
    }

    searchScreenOpened = (params) => {
        Mixpanel.track(mixpanelEvent.searchScreenOpened, {
            searchScreenType: params ? .searchScreenType,
            source: params ? .source,
        });
    }

    SearchResultsShown = (params) => {
        Mixpanel.track(mixpanelEvent.SearchResultsShown, {
            searchScreenType: params ? .searchScreenType,
            source: params ? .source,
            queryLength: params ? .queryLength,
            queryString: params ? .queryString,
            totalResults: params ? .totalResults,
            STOP: params ? .STOP,
            LOCATION: params ? .LOCATION,
        });
    }

    searchResultClicked = (params) => {
        Mixpanel.track(mixpanelEvent.searchResultClicked, {
            queryLength: params ? .queryLength,
            queryString: params ? .queryString,
            searchResultName: params ? .searchResultName,
            searchResultId: params ? .searchResultId,
            searchResultPosition: params ? .searchResultPosition,
            searchResultType: params ? .searchResultType,
            searchScreenType: params ? .searchScreenType,
            source: params ? .source,
        });
    }

    destinationSearchInitiated = (params) => {
        Mixpanel.track(mixpanelEvent.destinationSearchInitiated, {
            search_query: params ? .search_query,
        });
    }
}

class _logBookingFlowEvent {
    homeScreenProductHookClick = (params) => {
        Mixpanel.track(mixpanelEvent.homeScreenProductionHookClicked, {
            ...params,
        });
    }

    productSelected = (params) => {
        Mixpanel.track(mixpanelEvent.productSelect, {
            ...params,
        });
    }

    productSubmitForVerification = (params) => {
        const productId = params ? .passProps ? .configurationId;
        Mixpanel.track(mixpanelEvent.productSubmitForVerification, {
            productId,
        });
    }

    productMakePaymetClick = (params) => {
        const productId = params ? .passProps ? .configurationId;
        Mixpanel.track(mixpanelEvent.productMakePaymentClicked, {
            productId,

        });
    }
}

class _logHistoryEvent {
    historyButtonClick = (params) => {
        Mixpanel.track(mixpanelEvent.historyButtonClick, {
            ...params,
        });
    }

    historyBookingItemClick = (params) => {
        Mixpanel.track(mixpanelEvent.historyBookingItemClick, {
            ...params,
        });
    }
}

class _logActivationEvent {
    startTripClick = (params) => {
        Mixpanel.track(mixpanelEvent.startTripClick, {
            ...params,
        });
    }

    toneScreenOpened = (params) => {
        Mixpanel.track(mixpanelEvent.toneScreenOpened, {
            ...params,
        });
    }

    tonePlayed = (params) => {
        Mixpanel.track(mixpanelEvent.tonePlayed, {
            ...params,
        });
    }

    toneStopped = (params) => {
        Mixpanel.track(mixpanelEvent.toneStoped, {
            ...params,
        });
    }

    toneResumed = (params) => {
        Mixpanel.track(mixpanelEvent.toneResumed, {
            ...params,
        });
    }

    qrScreenOpened = (params) => {
        Mixpanel.track(mixpanelEvent.qrScreenOpened, {
            ...params,
        });
    }

    passBooked = (params) => {
        Mixpanel.track(mixpanelEvent.passBooked, {
            fullName: params ? .fullName,
            mobileNumber: params ? .mobileNumber,
            numOfDays: params ? .numOfDays,
            productType: params ? .productType,
            productSubType: params ? .productSubType,
            passId: params ? .passId,
            transactionId: params ? .transactionId,
            configId: params ? .configId,
            payableAmount: params ? .payableAmount,
            numOfTrips: params ? .numOfTrips,
            remainingTrips: params ? .remainingTrips,
            maxTripsPerDay: params ? .maxTripsPerDay,
            maxPricePerTrip: params ? .maxPricePerTrip,
            categoryId: params ? .categoryId,
            orderId: params ? .orderId,
            bookingId: params ? .bookingId,
            bookingTime: params ? .bookingTime,
            expiryTime: params ? .expiryTime,
            productId: params ? .productId,
            isSuperPass: params ? .isSuperPass,
        });
    }
}

class _logMticketEvent {
    ticketRouteSelect = (params) => {
        Mixpanel.track(mixpanelEvent.ticketRouteSelect, {
            'route name': params ? .route_name,
            'route id': params ? .ticketLastStopSelect,
        });
    }

    ticketRouteSelectUsingLink = (params) => {
        Mixpanel.track(mixpanelEvent.ticketRouteSelectUsingLink, {
            'route name': params ? .route_name,
            'route id': params ? .route_id,
        });
    }

    ticketFirstStopSelect = (params) => {
        Mixpanel.track(mixpanelEvent.ticketFirstStopSelect, {
            name: params ? .stop_name,
            id: params ? .stop_id,
        });
    }

    ticketLastStopSelect = (params) => {
        Mixpanel.track(mixpanelEvent.ticketLastStopSelect, {
            name: params ? .stop_name,
            id: params ? .stop_id,
        });
    }

    ticketSelectionNextButtonClick = (params) => {
        Mixpanel.track(mixpanelEvent.ticketSelectionNextButtonClick, {
            'route name': params ? .route ? .route_name,
            'route id': params ? .route ? .ticketLastStopSelect,
        });
    }

    ticketFareFetch = (params) => {
        Mixpanel.track(mixpanelEvent.ticketFareFetch, {
            'route name': params ? .route ? .route_name,
            'route id': params ? .route ? .ticketLastStopSelect,
            'fist stop id': params ? .startStop ? .stop_id,
            'fist stop name': params ? .startStop ? .stop_name,
            'last stop id': params ? .endStop ? .stop_id,
            'last stop name': params ? .endStop ? .stop_name,
        });
    }
}

class _logPremiumEvent {
    tripDetailsScreenShown = (params) => {
        Mixpanel.track(mixpanelEvent.tripDetailsScreenShown, {
            previousScreen: params ? .previousScreen,
            rebookCardCount: params ? .rebookCardCount,
            source: params ? .source,
        });
    }

    sourceSearchIntitiated = (params) => {
        Mixpanel.track(mixpanelEvent.sourceSearchIntitiated, {
            searchQuery: params ? .searchQuery,
        });
    }

    destinationSearchIntitiated = (params) => {
        Mixpanel.track(mixpanelEvent.destinationSearchIntitiated, {
            searchQuery: params ? .searchQuery,
        });
    }

    sourceSelected = (params) => {
        Mixpanel.track(mixpanelEvent.sourceSelected, {
            searchSource: params ? .searchSource,
            searchResultCount: params ? .searchResultCount,
            searchResultSelectedRank: params ? .searchResultSelectedRank,
            locationName: params ? .locationName,
            locationType: params ? .locationType,
            locationLat: params ? .locationLat,
            locationLong: params ? .locationLong,

        });
    }

    destinationSelected = (params) => {
        Mixpanel.track(mixpanelEvent.destinationSelected, {
            searchSource: params ? .searchSource,
            searchResultCount: params ? .searchResultCount,
            searchResultSelectedRank: params ? .searchResultSelectedRank,
            locationName: params ? .locationName,
            locationType: params ? .locationType,
            locationLat: params ? .locationLat,
            locationLong: params ? .locationLong,
        });
    }

    tripDetailsSubmitted = (params) => {
        Mixpanel.track(mixpanelEvent.tripDetailsSubmitted, {
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    rebookCardClicked = (params) => {
        Mixpanel.track(mixpanelEvent.rebookCardClicked, {
            selectedCardRank: params ? .selectedCardRank,
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    pickupDropOptionsFetched = (params) => {
        Mixpanel.track(mixpanelEvent.pickupDropOptionsFetched, {
            noOfCombinationsShown: params ? .noOfCombinationsShown,
            firstCombinationWalkingTime: params ? .firstCombinationWalkingTime,
            firstCombinationPickupID: params ? .firstCombinationPickupID,
            firstCombinationPickupName: params ? .firstCombinationPickupName,
            firstCombinationDropID: params ? .firstCombinationDropID,
            firstCombinationDropName: params ? .firstCombinationDropName,
        });
    }

    noRouteErrorDisplayed = (params) => {
        Mixpanel.track(mixpanelEvent.noRouteErrorDisplayed, {
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    pickupDropSelected = (params) => {
        Mixpanel.track(mixpanelEvent.pickupDropSelected, {
            selectedCardRank: params ? .selectedCardRank,
            searchSource: params ? .searchSource,
            pickupName: params ? .pickupName,
            pickupID: params ? .pickupID,
            dropName: params ? .dropName,
            dropID: params ? .dropID,
        });
    }

    timeSlotsFetched = (params) => {
        Mixpanel.track(mixpanelEvent.timeSlotsFetched, {
            currentDaySctiveSlotCount: params ? .currentDaySctiveSlotCount,
            allDaysActiveSlotsCount: params ? .allDaysActiveSlotsCount,
            currentDaySoldOutSlots: params ? .currentDaySoldOutSlots,
            allDaysSoldoutSlotCount: params ? .allDaysSoldoutSlotCount,
            nextAvailableTimeSlot: params ? .nextAvailableTimeSlot,
            fromStopName: params ? .fromStopName,
            fromStopId: params ? .fromStopId,
            toStopName: params ? .toStopName,
            toStopId: params ? .toStopId,
        });
    }

    timeSlotsNotFetched = (params) => {
        Mixpanel.track(mixpanelEvent.timeSlotsNotFetched, {
            fromStopName: params ? .fromStopName,
            fromStopId: params ? .fromStopId,
            toStopName: params ? .toStopName,
            toStopId: params ? .toStopId,
            errorMessage: params ? .errorMessage,
        });
    }

    noSlotAvailable = (params) => {
        Mixpanel.track(mixpanelEvent.noSlotAvailable, {
            selectedSlotFromStopId: params ? .selectedSlotFromStopId,
            selectedSlotToStopId: params ? .selectedSlotToStopId,
            selectedSlotRouteId: params ? .selectedSlotRouteId,
            selectedSlotRouteName: params ? .selectedSlotRouteName,
            selectedSlotSeatAvailable: params ? .selectedSlotSeatAvailable,
        });
    }

    selectedSlot = (params) => {
        Mixpanel.track(mixpanelEvent.selectedSlot, {
            selectedSlotFromStopId: params ? .selectedSlotFromStopId,
            selectedSlotToStopId: params ? .selectedSlotToStopId,
            selectedSlotRouteId: params ? .selectedSlotRouteId,
            selectedSlotRouteName: params ? .selectedSlotRouteName,
            selectedSlotSeatAvailable: params ? .selectedSlotSeatAvailable,
            tripId: params ? .tripId,
            slotDate: params ? .slotDate,
            slotTime: params ? .slotTime,
            arrivalTime: params ? .arrivalTime,
        });
    }

    homeCardClick = () => {
        Mixpanel.track(mixpanelEvent.homeCardClick);
    }

    trackBusClicked = () => {
        Mixpanel.track(mixpanelEvent.homeCardClick);
    }

    verifyTicketClicked = (params) => {
        Mixpanel.track(mixpanelEvent.verifyTicketClicked, {
            bookingId: params ? .bookingId,
        });
    }

    activeBookingOptionsClicked = () => {
        Mixpanel.track(mixpanelEvent.activeBookingOptionsClicked);
    }

    activeBookingOptionItemClicked = (params) => {
        Mixpanel.track(mixpanelEvent.activeBookingOptionItemClicked, {
            optionClicked: params ? .optionClicked,
        });
    }

    bookingCancellationSuccessful = (params) => {
        Mixpanel.track(mixpanelEvent.bookingCancellationSuccessful, {
            ...params,
        });
    }

    bookingOptionSelected = (params) => {
        Mixpanel.track(mixpanelEvent.bookingOptionSelected, {
            selectionSource: params ? .selectionSource,
            optionSelected: params ? .optionSelected,
        });
    }

    bookingConfirmed = (params) => {
        Mixpanel.track(mixpanelEvent.bookingConfirmed, {
            bookingSource: params ? .bookingSource,
            tripId: params ? .tripId,
            routeId: params ? .routeId,
            routename: params ? .routename,
            tripDate: params ? .tripDate,
            pickupStopID: params ? .pickupStopID,
            pickupStopName: params ? .pickupStopName,
            dropStopId: params ? .dropStopId,
            dropStopName: params ? .dropStopName,
            bookingID: params ? .bookingID,
        });
    }

    routeDetailsReserveSeatBtnClicked = (params) => {
        Mixpanel.track(mixpanelEvent.routeDetailsReserveSeatBtnClicked, {
            isUserLoggedIn: params ? .isUserLoggedIn,
            city: params ? .city,
            upTripRouteId: params ? .upTripRouteId,
            isAirportRoute: params ? .isAirportRoute,
            isChaloBusRoute: params ? .isChaloBusRoute,
        });
    }

    pbBookingCardExpired = (params) => {
        Mixpanel.track(mixpanelEvent.pbBookingCardExpired, {
            source: params ? .source,
            booking_id: params ? .booking_id,
            trip_id: params ? .trip_id,
            route_id: params ? .route_id,
        });
    }
}

class _logAirportEvent {
    tripDetailsScreenShown = (params) => {
        Mixpanel.track(mixpanelEvent.tripDetailsScreenShownAR, {
            previousScreen: params ? .previousScreen,
            rebookCardCount: params ? .rebookCardCount,
        });
    }

    sourceSearchIntitiated = (params) => {
        Mixpanel.track(mixpanelEvent.sourceSearchIntitiatedAR, {
            searchQuery: params ? .searchQuery,
        });
    }

    destinationSearchIntitiated = (params) => {
        Mixpanel.track(mixpanelEvent.destinationSearchIntitiatedAR, {
            searchQuery: params ? .searchQuery,
        });
    }

    sourceSelected = (params) => {
        Mixpanel.track(mixpanelEvent.sourceSelectedAR, {
            searchSource: params ? .searchSource,
            searchResultCount: params ? .searchResultCount,
            searchResultSelectedRank: params ? .searchResultSelectedRank,
            locationName: params ? .locationName,
            locationType: params ? .locationType,
            locationLat: params ? .locationLat,
            locationLong: params ? .locationLong,

        });
    }

    destinationSelected = (params) => {
        Mixpanel.track(mixpanelEvent.destinationSelectedAR, {
            searchSource: params ? .searchSource,
            searchResultCount: params ? .searchResultCount,
            searchResultSelectedRank: params ? .searchResultSelectedRank,
            locationName: params ? .locationName,
            locationType: params ? .locationType,
            locationLat: params ? .locationLat,
            locationLong: params ? .locationLong,
        });
    }

    tripDetailsSubmitted = (params) => {
        Mixpanel.track(mixpanelEvent.tripDetailsSubmittedAR, {
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    rebookCardClicked = (params) => {
        Mixpanel.track(mixpanelEvent.rebookCardClickedAR, {
            selectedCardRank: params ? .selectedCardRank,
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    pickupDropOptionsFetched = (params) => {
        Mixpanel.track(mixpanelEvent.pickupDropOptionsFetchedAR, {
            noOfCombinationsShown: params ? .noOfCombinationsShown,
            firstCombinationWalkingTime: params ? .firstCombinationWalkingTime,
            firstCombinationPickupID: params ? .firstCombinationPickupID,
            firstCombinationPickupName: params ? .firstCombinationPickupName,
            firstCombinationDropID: params ? .firstCombinationDropID,
            firstCombinationDropName: params ? .firstCombinationDropName,
        });
    }

    noRouteErrorDisplayed = (params) => {
        Mixpanel.track(mixpanelEvent.noRouteErrorDisplayedAR, {
            searchSource: params ? .searchSource,
            sourceName: params ? .sourceName,
            sourceType: params ? .sourceType,
            sourceLat: params ? .sourceLat,
            sourceLong: params ? .sourceLong,
            destinationName: params ? .destinationName,
            destinationType: params ? .destinationType,
            destinationLat: params ? .destinationLat,
            destinationLong: params ? .destinationLong,
        });
    }

    pickupDropSelected = (params) => {
        Mixpanel.track(mixpanelEvent.pickupDropSelectedAR, {
            selectedCardRank: params ? .selectedCardRank,
            searchSource: params ? .searchSource,
            pickupName: params ? .pickupName,
            pickupID: params ? .pickupID,
            dropName: params ? .dropName,
            dropID: params ? .dropID,
        });
    }

    timeSlotsFetched = (params) => {
        Mixpanel.track(mixpanelEvent.timeSlotsFetchedAR, {
            currentDaySctiveSlotCount: params ? .currentDaySctiveSlotCount,
            allDaysActiveSlotsCount: params ? .allDaysActiveSlotsCount,
            currentDaySoldOutSlots: params ? .currentDaySoldOutSlots,
            allDaysSoldoutSlotCount: params ? .allDaysSoldoutSlotCount,
            nextAvailableTimeSlot: params ? .nextAvailableTimeSlot,
            fromStopName: params ? .fromStopName,
            fromStopId: params ? .fromStopId,
            toStopName: params ? .toStopName,
            toStopId: params ? .toStopId,
        });
    }

    timeSlotsNotFetched = (params) => {
        Mixpanel.track(mixpanelEvent.timeSlotsNotFetchedAR, {
            fromStopName: params ? .fromStopName,
            fromStopId: params ? .fromStopId,
            toStopName: params ? .toStopName,
            toStopId: params ? .toStopId,
            errorMessage: params ? .errorMessage,
        });
    }

    noSlotAvailable = (params) => {
        Mixpanel.track(mixpanelEvent.noSlotAvailableAR, {
            selectedSlotFromStopId: params ? .selectedSlotFromStopId,
            selectedSlotToStopId: params ? .selectedSlotToStopId,
            selectedSlotRouteId: params ? .selectedSlotRouteId,
            selectedSlotRouteName: params ? .selectedSlotRouteName,
            selectedSlotSeatAvailable: params ? .selectedSlotSeatAvailable,
        });
    }

    selectedSlot = (params) => {
        Mixpanel.track(mixpanelEvent.selectedSlotAR, {
            selectedSlotFromStopId: params ? .selectedSlotFromStopId,
            selectedSlotToStopId: params ? .selectedSlotToStopId,
            selectedSlotRouteId: params ? .selectedSlotRouteId,
            selectedSlotRouteName: params ? .selectedSlotRouteName,
            selectedSlotSeatAvailable: params ? .selectedSlotSeatAvailable,
            tripId: params ? .tripId,
            slotDate: params ? .slotDate,
            slotTime: params ? .slotTime,
            arrivalTime: params ? .arrivalTime,
        });
    }

    verifyTicketClicked = (params) => {
        Mixpanel.track(mixpanelEvent.verifyTicketClickedAR, {
            bookingId: params ? .bookingId,
        });
    }

    activeBookingOptionsClicked = () => {
        Mixpanel.track(mixpanelEvent.activeBookingOptionsClickedAR);
    }

    activeBookingOptionItemClicked = (params) => {
        Mixpanel.track(mixpanelEvent.activeBookingOptionItemClickedAR, {
            optionClicked: params ? .optionClicked,
        });
    }

    bookingCancellationSuccessful = (params) => {
        Mixpanel.track(mixpanelEvent.bookingCancellationSuccessfulAR, {
            ...params,
        });
    }

    bookingOptionSelected = (params) => {
        Mixpanel.track(mixpanelEvent.bookingOptionSelectedAR, {
            selectionSource: params ? .selectionSource,
            optionSelected: params ? .optionSelected,
        });
    }

    bookingConfirmed = (params) => {
        Mixpanel.track(mixpanelEvent.bookingConfirmedAR, {
            bookingSource: params ? .bookingSource,
            tripId: params ? .tripId,
            routeId: params ? .routeId,
            routename: params ? .routename,
            tripDate: params ? .tripDate,
            pickupStopID: params ? .pickupStopID,
            pickupStopName: params ? .pickupStopName,
            dropStopId: params ? .dropStopId,
            dropStopName: params ? .dropStopName,
        });
    }

    firstrideAirportexpress = (params) => {
        Mixpanel.track(mixpanelEvent.firstrideAirportexpress, {
            ...params,
        });
    }

    airportExpressPlanPurchased = (params) => {
        Mixpanel.track(mixpanelEvent.airport_express_plan_purchased, {
            ...params,
        });
    }

    bookingAirportexpress = (params) => {
        Mixpanel.track(mixpanelEvent.bookingAirportexpress, {
            ...params,
        });
    }

    firstrideNonAirportexpress = (params) => {
        Mixpanel.track(mixpanelEvent.firstrideNonAirportexpress, {
            ...params,
        });
    }

    bookingNonAirportexpress = (params) => {
        Mixpanel.track(mixpanelEvent.bookingNonAirportexpress, {
            ...params,
        });
    }

    userLallaploozaFormDetails = (params) => {
        Mixpanel.track(mixpanelEvent.userLallaploozaFormDetails, {
            ...params,
        });
    }
}

class LogLoginEvents {
    loginFailed = (params) => {
        Mixpanel.track(mixpanelEvent.loginFailed, {
            message: params ? .message,
        });
    }

    loginSuccessful = (params) => {
        Mixpanel.track(mixpanelEvent.loginSuccessful, {
            ...params,
        });
    }

    loginOtpRequestFailed = (params) => {
        Mixpanel.track(mixpanelEvent.loginOtpRequestFailed, {
            message: params ? .message,
        });
    }

    loginScreenDisplayed = (params) => {
        Mixpanel.track(mixpanelEvent.loginScreenDisplayed, {
            ...params,
        });
    };

    loginOtpScreenDisplayed = (params) => {
        Mixpanel.track(mixpanelEvent.loginOtpScreenDisplayed, {
            ...params,
        });
    };

    deviceIdGenrated = (params) => {
        Mixpanel.track(mixpanelEvent.deviceIdGenrated, {
            ...params,
        });
    };

    deviceIdNotFound = (params) => {
        Mixpanel.track(mixpanelEvent.deviceIdNotFound, {
            ...params,
        });
    };
}

class LogLandingScreenProduct {
    productSelected = (params) => {
        Mixpanel.track(mixpanelEvent.landingScreenProductSelected, {
            offerCode: params ? .offerCode,
            desc: params ? .desc,
            fare: params ? .fare,
            numOfTrips: params ? .numOfTrips,
        });
    };

    pbWelcomeOfferPurchased = (params) => {
        Mixpanel.track(mixpanelEvent.pb_welcome_offer_purchased, {
            ...params,
        });
    };

    pbSubscription20RidesPurchased = (params) => {
        Mixpanel.track(mixpanelEvent.pb_subscription_20_rides_purchased, {
            ...params,
        });
    };

    pbSubscription45RidesPurchased = (params) => {
        Mixpanel.track(mixpanelEvent.pb_subscription_45_rides_purchased, {
            ...params,
        });
    };

    landingScreenOpen = (params) => {
        Mixpanel.track(mixpanelEvent.landingScreenOpen, {
            ...params,
        });
    }

    PwaWelcomeOfferAlreadyPurchased = (params) => {
        Mixpanel.track(mixpanelEvent.PwaWelcomeOfferAlreadyPurchased, {
            ...params,
        });
    }

    passBookedLandingScreen = (params) => {
        Mixpanel.track(`${mixpanelEvent.passBookedLandingScreen}${params?.configId} with ${params?.numOfTrips} rides`, {
            ...params,
        });
    }
}

const SetSuperAndProfileProperities = new _SetSuperAndProfileProperities();
const logBookingFlowEvent = new _logBookingFlowEvent();
const logEvent = new _logEvent();
const logHistoryEvent = new _logHistoryEvent();
const logActivationEvent = new _logActivationEvent();
const logMticketEvent = new _logMticketEvent();
const logPremiumEvent = new _logPremiumEvent();
const logAirportEvent = new _logAirportEvent();
const loginEvents = new LogLoginEvents();
const logLandingScreenProduct = new LogLandingScreenProduct();

export {
    SetSuperAndProfileProperities,
    logBookingFlowEvent,
    logEvent,
    logHistoryEvent,
    logActivationEvent,
    logMticketEvent,
    logPremiumEvent,
    logAirportEvent,
    loginEvents,
    logLandingScreenProduct,
};