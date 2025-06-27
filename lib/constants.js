import {
    OnBoardingMumbaiImage,
    BestFastMumbaiImage,
    BestFastRourkelaImage,
    BrandingRourkelImage,
    OnBoardingRourkelaImage,
} from '../Images';

const UiRoutes = {
    home: '/',
    productHooks: '/productHooks',
    viewProduct: '/productHooks/products',
    networkError: '/network-error',
    viewAllProduct: '/productHooks/allProducts',
    busPassPurchase: '/productHooks/bus-pass-purchase',
    subCatSelection: '/productHooks/bus-pass-purchase/sub-category-selection/:configId',
    passFaresDetail: '/productHooks/bus-pass-purchase/fares/:configId',
    passFaresDetailModal: '/productHooks/bus-pass-purchase/fares/:configId/confirmation',
    buyBusTicket: '/buy-bus-ticket',
    personalDetails: '/productHooks/bus-pass-purchase/personal-details',
    confirmDetailsAndPay: '/productHooks/bus-pass-purchase/confirm-details-and-pay',
    documents: '/productHooks/bus-pass-purchase/document',
    uploadDocuments: '/productHooks/bus-pass-purchase/upload-documents',
    documentVerify: '/productHooks/bus-pass-purchase/document-verify',
    bookingSuccessful: '/productHooks/bus-pass-purchase/booking-successful/:transactionId',
    submitForVerificationSuccessful: '/productHooks/bus-pass-purchase/submit-for-verification-successful/:transactionId',
    viewImage: '/productHooks/bus-pass-purchase/:view-image',
    DocumentVerifyPending: '/productHooks/bus-pass-purchase/document-verify-pending',
    purchasePassAfterVerification: '/productHooks/bus-pass-purchase/purchase-pass-after-verification/:transactionId/:isRenew',
    resubmitForVerification: '/productHooks/bus-pass-purchase/resubmit-for-verification/:transactionId',

    yourTickets: '/your-tickets-and-passes',
    summary: '/your-tickets-and-passes/summary/:transactionId',
    rideReceipt: '/your-tickets-and-passes/ride-receipt/:transactionId',
    soundQR: '/your-tickets-and-passes/sound-qr/:transactionId',
    scanQR: '/your-tickets-and-passes/scan-qr/:transactionId',
    beforeActivation: '/your-tickets-and-passes/before-activation/:transactionId',
    contactLessTicketValidation: '/your-tickets-and-passes/sound-qr/:transactionId/contact-less-ticket-validation',
    passValidation: '/your-tickets-and-passes/pass-validation/:transactionId',
    verificationRejection: '/your-tickets-and-passes/verification-rejection/:transactionId',
    rideHistory: '/your-tickets-and-passes/ride-history/:transactionId',
    documentVerificationFailed: '/document-verification-failed/:transactionId',

    selectTrip: '/select-trip',
    selectTripRoute: '/select-trip/select-route',
    selectStop: '/select-trip/select-stop',
    selectTicket: '/select-trip/select-ticket',
    successBooking: '/select-trip/select-ticket/booking-success/:transactionId',
    singleJourneyTicket: '/select-trip/single-journey-ticket',
    oneWayTicket: '/one-way-ticket',
    profile: '/profile',
    editProfile: '/profile/edit-profile',
    login: '/login/:redirectPath',
    loginWithoutParams: '/login',
    onboarding: '/onboarding',
    loginOtp: '/login/login-otp/:redirectPath',
    loginOtpWithoutParams: '/login/login-otp',
    changeCity: '/change-city',

    liveTracking: '/live-tracking',
    routeMap: '/live-tracking/route-map/:routeId',
    routeMapStop: '/live-tracking/route-map/:routeId/:stopId',
    routeMapWithVehicle: '/live-tracking/route-map-vehicle/:routeId/:stopId/:vehicleNo/:transactionId/:scheduleTime',
    estimateArrivalTime: '/live-tracking/estimate-arrival-time/:routeId/:stopId/:stopName/:routeName',
    timeTable: '/live-tracking/time-table/:routeId',
    promotion: '/promotion',
    onBoardingMumbai: '/on-boarding-mumbai',

    SOS: '/SOS',
    editSOSMessage: '/SOS/editSOSMessage',
    Favorites: '/Favorites',
    searchFavorites: '/Favorites/search/:data',
    selectCard: '/select-card',
    cardPayments: '/card-payments',
    confirmAndPayCardRecharge: '/select-card/confirm-details-and-pay',
    cardPaymentSummary: '/select-card/card-payment-summary',
    amountSelection: '/select-card/amount-selection',
    cardRechargeSuccessful: '/select-card/card-recharge-successful/:transectionId',
    ncmcCardRecharge: '/ncmc-card-recharge',
    ncmcCardRechargeSuccessful: '/ncmc-card-recharge/ncmc-card-recharge-successful/:cardType',
    ncmcAmountSelection: '/ncmc-card-recharge/amount-selection',
    ncmcPaymentScreen: '/ncmc-card-recharge/payment-details',
    transferInOfflineWallet: '/ncmc-card-recharge/tranfer-in-offline-wallet',
    addBalance: '/recharge',
    semiclosedAmountSelection: '/recharge/amount-selection',

    tripPlanner: '/live-tracking/trip-planner',
    selectedTripDetails: '/live-tracking/selected-trip-details',
    tripPlannerStops: '/live-tracking/trip-planner-stops/:id',
    findMyBus: '/live-tracking/find-my-bus',

    nearestBusStop: '/nearest-bus-stop',
    allBuses: '/nearest-bus-stop/all-buses/:stopId/:stopName/:distance',
    nearBusStops: '/nearest-bus-stop/near-bus-stops',
    timings: '/nearest-bus-stop/timings',
    liveMap: '/nearest-bus-stop/live-map',
    routeStops: '/nearest-bus-stop/route-stops',
    results: '/live-tracking/results',

    changeLanguage: '/change-language',

    paymentScreen: '/select-payment',
    selectPayment: '/select-payment/:agency/:productType/:orderId',
    card: '/select-payment/card',
    wallet: '/select-payment/wallet',
    upi: '/select-payment/upi',
    netbanking: '/select-payment/netbanking',
    cash: '/select-payment/cash',
    myCards: '/chalo-card',
    linkCardForm: '/chalo-card/link-card-form',
    cardHistory: '/chalo-card/card-history/:cardNumber',
    cardSummury: '/chalo-card/summury',

    premiumBusesTripDetails: '/premium-buses',
    searchStopsPremiumBuses: '/premium-buses/search-stops-premium-buses',
    payForTicketPremiumBuses: '/premium-buses/pay-for-ticket',
    viewPremiumProduct: '/premium-buses/view-premium-product',
    selectSlot: '/premium-buses/select-slot',
    fareDetails: '/premium-buses/fare-details',
    premiumBusSuccessfulTicketBooking: '/premium-buses/ticket-successful-booking/:transactionId',
    premiumBusBeforeActivation: '/premium-buses/before-activation/:transactionId',
    premiumBusSummary: '/premium-buses/premium-bus-summary/:transactionId',
    payForTicket: '/pay-for-ticket',
    userDetails: '/pay-for-ticket/user-details',
    rideReceiptForInstantTicket: '/your-tickets-and-passes/ride-receipt-instant-ticket/:transactionId',
    InstantTicket: '/instant-ticket',
    cancellationRescheduleCard: '/premium-buses/cancellationRescheduleCard/:transactionId',
    tripCancellationCard: '/premium-buses/tripCancellationCard',
    premiumTicketPurchaseUsingPass: '/premium-buses/premiumTicketPurchaseUsingPass',

    airportExperience: '/airport-experience',
    airportExperienceLanding: '/airport-experience/:city',
    airportStaticQRStandee: '/airport-experience/eta/:type',
    // selectODPairAirport: '/airport-experience/select-stops/:city/:stopId',
    selectSlotAirport: '/airport-experience/select-slots',

    bookProduct: '/book/bookProduct/:city/:configId',
    bookTicket: '/book/bookTicket/:city/:routeId',
    premiumBusProducts: '/products-landing',
    premiumBusProductsConfigId: '/products-landing/:configId',
    premiumBusProductsBank: '/offers/:bank/:city',
    tripPlannerSearch: '/trip-planner',
    tripPlannerSearchResults: '/trip-planner/results',
    selectedTripCardDetails: '/trip-planner/selected-trip-card-details',
    buyPass: '/buy-pass/:city/:configId/:category/:subCategory/:fmId',
};

const CRUD_IDS = {
    getProfile: 'GET_PROFILE',
    postProfile: 'POST_PROFILE',
    putProfile: 'PUT_PROFILE',
    getOTP: 'GET_OTP',
    validateOTP: 'LOGIN',
    userLogin: 'USER_LOGIN',
    getCityConfig: 'GET_CITY_CONFIG',
    getProductConfig: 'GET_PRODUCT_CONFIG',
    setProfileImage: 'SET_PROFILE_IMAGE',
    PostBusPassBooking: 'POST_BUS_PASS_BOOKING',
    checkOrderStatus: 'CHECK_ORDER_STATUS',
    PostSuperPassBookingWithoutVerification: 'POST_SUPER_PASS_BOOKING_WITHOUT_VERIFICATION',
    createPassOrder: 'CREATE_PASS_ORDER',
    getPaymentMethods: 'GET_PAYMENT_METHODS',
    submitSuperPassDocForVerification: 'SUBMIT_SUPER_PASS_DOC_FOR_VERIFICATION',
    getPaymentStatus: 'GET_PAYMENT_STATUS',
    getUserHistory: 'GET_USER_HISTORY',
    getRouteSearchData: 'GET_ROUTE_SEARCH_DATA',
    getRouteLiveInfo: 'GET_ROUTE_LIVE_INFO',
    getSeatAvailability: 'GET_SEAT_AVAILABILITY',
    getHomeCardInfo: 'GET_HOME_CARD_INFO',
    getNearestBusesData: 'GET_NEAREST_BUSES_DATA',
    getCityMetaData: 'GET_CITY_META_DATA',
    getChaloTime: 'GET_CHALO_TIME',
    craeteTicketOrder: 'CREATE_TICKET_ORDER',
    getTicketFare: 'GET_TICKET_FARE',
    getRideHistory: 'GET_RIDE_HISTORY',
    getTicketVerified: 'GET_TICKET_VERIFIED',
    getNearestBusStops: 'GET_NEAREST_BUS_STOPS',
    getNearestBusStopsMapData: 'GET_NEAREST_BUS_STOPS_MAP_DATA',
    getStopAllBuses: 'GET_STOP_ALL_BUSES',
    getTripPlannerStopData: 'GET_TRIP_PLANNER_STOPS_DATA',
    getFindMyBusStopData: 'GET_FIND_MY_BUS_STOPS_DATA',
    getPlaceData: 'GET_PLACE_DATA',
    getPlaceDataStops: 'GET_PLACE_DATA_STOPS',

    getNearestBusStopsETA: 'GET_NEAREST_BUS_STOPS_ETA',
    getNearestAllBusStopsETA: 'GET_NEAREST_ALL_BUS_STOPS_ETA',
    getAllBussesSeatAvailability: 'GET_ALL_BUSSES_SEAT_AVAILABILITY',
    getBussesSeatAvailability: 'GET_BUSSES_SEAT_AVAILABILITY',
    getResultBussesStopsETA: 'GET_RESULT_BUSSES_STOP_ETA',
    getSelectedTripBussesStopsETA: 'GET_SELECTED_TRIP_BUSSES_STOP_ETA',
    getselectedTripBussesSeatAvailability: 'GET_SELECTED_TRIP_BUSSES_SEAT_AVAILABILITY',
    getNearestBusHomeStopsETA: 'GET_NEAREST_BUS_HOME_STOPS_ETA',

    getCardEligibility: 'GET_CARD_ELIGIBILITY',
    makeCardRecharge: 'MAKE_CARD_RECHARGE',
    getCardRechargeHistory: 'GET_CARD_RECHARGE_HISTORY',
    getCardRechargeConfig: 'GET_CARD_RECHARGE_CONFIG',
    getCardList: 'GET_CARD_LIST',
    getCardListDetails: 'GET_CARD_LIST_DETAILS',
    createNCMCOrder: 'CREATE_NCMC_ORDER',
    createNCMCOfflineOrder: 'CREATE_OFFLINE_NCMC_ORDER',
    offlineNCMCPaymentStatus: 'PAYMENT_STATUS_OFFLINE_NCMC_REACHARGE',
    linkCard: 'LINK_CARD',
    getCardDetails: 'GET_CARD_DETAILS',
    getCradHistory: 'GET_CARD_HISTORY',

    getODPairForPremiumBusStops: 'GET_OD_PAIR_ROUTE_DETAILS',
    getSlotDataForPremiumBuses: 'GET_SLOT_DATA_FOR_PREMIUM_BUSES',
    getAvailablePremiumPasses: 'GET_AVAILABLE_PREMIUM_PASSES',
    productFetchPlan: 'FETCH_PRODUCT_PLAN',
    getBookingTripDetails: 'GET_BOOKING_TRIP_DETAILS',
    getActionForPremiumTicket: 'GET_ACTION_FOR_PREMIUM_TICKET',
    getReasonsOptionsList: 'GET_REASONS_OPTIONS_LIST',
    cancelPrebookedPremiumTrip: 'CANCEL_PREBOOKED_PREMIUM_TICKET',
    reschedulePrebookedPremiumTrip: 'RESCHEDULE_PREBOOKED_PREMIUM_TICKET',
    bookPremiumTicketUsingPass: 'BOOK_PREMIUM_TICKET_USING_PASS',

    getPayForTicket: 'PAY_FOR_TICKET',
    instantTicketData: 'INSTANT_TICKET_DATA',
    viewReceipt: 'VIEW_RECEIPT',
    validateFair: 'VALIDATE_FAIR',
    LAST_UPDATED_TIME: 'LAST_UPDATED_TIME',
    getProductConfigPremiumBuses: 'GET_PRODUCT_CONFIG_PREMIUM_BUSES',
    getCityStops: 'GET_CITY_STOPS',
    getVehicleRouteInfo: 'GET_ROUTE_VEHICLE_INFO',

    getProductConfigAirport: 'GET_PRODUCT_CONFIG_AIRPORT',
};

const REDUX_STORE_IDS = {
    getCityConfig: 'GET_CITY_CONFIG',
    getProductConfig: 'GET_PRODUCT_CONFIG',
    PURCHASE_FLOW: 'PURCHASE_FLOW',
    getUserDocumentForBusPass: 'GET_USER_DOCUMENT',
    ROUTE_DATA: 'ROUTE_DATA',
    CATEGORY_VALUE: 'CATEGORY_VALUE',
    PRODUCT_HOOKS_CLICK: 'PRODUCT_HOOKS_CLICK',
    CARD_RECHARGE_DATA: 'CARD_RECHARGE_DATA',
    TRIP_PLANNER: 'TRIP-PLANNER',
    SELECTED_TRIP: 'SELECTED_TRIP',
    RECENT_SEARCHES: 'RECENT-SEARCHES',
    USER_CURRENT_LOCATION: 'USER_CURRENT_LOCATION',
    ACTIVE_TAB: 'ACTIVE-TAB',
    ACTIVE_TAB_SLOT_BOKKING: 'ACTIVE_TAB_SLOT_BOKKING',
    HOME_HEADER_CARD_STATE: 'HOME_HEADER_CARD_STATE',
    SEARCH_INPUT_TEXT: 'SEARCH_INPUT_TEXT',
    GET_CARD_RECHARGE_CONFIG: 'GET_CARD_RECHARGE_CONFIG',
    GET_CARD_RECHARGE_CONFIG_LIST: 'GET_CARD_RECHARGE_CONFIG_LIST',
    CHALO_CARD_CLICK: 'CHALO_CARD_CLICK',

    PAYMENT_DATA: 'PAYMENT_DATA',
    SET_CURRENCY: 'SET_CURRENCY',
    CARD_RECHARGE_MAXIMUM_AMOUNT: 'CARD_RECHARGE_MAXIMUM_AMOUNT',
    CARD_RECHARGE_INFO: 'CARD_RECHARGE_INFO',
    CHALO_CARD_TICKET_DATA: 'CHALO_CARD_TICKET_DATA',
    LAST_UPDATED_TIME: 'LAST_UPDATED_TIME',
    PREMIUM_BUSES_PURCHASE_FLOW: 'PREMIUM_BUSES_PURCHASE_FLOW',
    ACTION_CLICKED_FOR_PREMIUM_TICKET: 'ACTION_CLICKED_FOR_PREMIUM_TICKET',
    DIRECT_TO_HOMESCREEN: 'DIRECT_TO_HOMESCREEN',
    PASSENGER_COUNT: 'PASSENGER_COUNT',
    PREMIUM_BUS_LANDING: 'PREMIUM_BUS_LANDING',
    REDIRECT_SCREEN: 'REDIRECT_SCREEN',
};
const ServerErrorCodes = {
    USER_PROFILE_ERROR: 'USER_DOES_NOT_EXIST',
    TRIAL_OFFER_ERROR: 'DIGITAL_OFFER_ALREADY_AVAILED',
    DIGITAL_OFFER_NOT_ALLOWED: 'DIGITAL_OFFER_NOT_ALLOWED',
};

const digitAllow = /^[\d]*$/;
const sixDigitOtpPattern = /^\d{6}$/;
const validationForOTP = /^[0-9.]+$/;
const OtpLength = 6;
const emailValidatorPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const alphabetsWithSpacesPattern = /^[a-zA-Z ]*$/;
const formName = {};

const formId = {};

const listIds = {};

const enums = {};

const numberValidation = /^\d+$/;
const numberValidationWithDot = /^[1-9]\d*(\.\d+)?$/;
const numberValidationWithSpace = /^[0-9\s]*$/;

const cardValidation = /^[\d ]*$/;

const airportTravelPlan = 'Airport Travel Plan';
const contentType = {
    MULTIPART: 'multipart',
};

const labelPaths = {
    DASHBOARD: 'dashboard',
};

const source = 'app';

const urls = {
    MAP: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAK_KlUuUHRmcn7VSrGdO_DE2JVc09ZfxM&v=3.exp&libraries=geometry,drawing,places',
    SEARCH_MAP: 'https://www.google.com/maps/search/?api=1&query=',
};

const dateFormat = 'DD-MM-YYYY';
const timeFormat = 'HH:mm:ss';
const dateFormatWithHour = 'MM-DD-YYYY HH:mm';
const dateFormatWith12Hour = 'MM-DD-YYYY hh:mm A';
const dateFormatWithSlash = 'DD/MM/YYYY';
const dateFormatWithMonthName = 'Do MMMM YY';
const dateFormatWithMonthNameFullYear = 'Do MMMM YYYY';
const dateFormatWithHalfMonthNameFullYear = 'DD MMM YYYY';
const dateFormatStartsWithYear = 'YYYY-MM-DD';
const dateFormatStartsWithYearHour = 'YYYY-MM-DD HH:mm';
const dateFormatStartsWithYearSeconds = 'YYYY-MM-DD HH:mm:ss';
const schedulerDataDateFormat = 'MM/DD/YYYY h:mm:ss A';
const ticketDataDateFormat = 'h:mm A on DD MMM YYYY';
const chaloCardDateFormat = 'hh:mm A, DD MMM YYYY';
const timeFormat12 = 'h:mm A';
const usedOnFormat = 'DD MMM YYYY, h:mm A';
const chaloCardTicketFormat = 'DD MMM YYYY, hh:mm A';
const premiumBusTimeFormat = 'h:mm A, DD MMM';

const mimeType = {
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    RAW: 'text/csv',
    CSV: 'text/csv',
};

const responseType = {
    ARRAY_BUFFER: 'arraybuffer',
    BLOB: 'blob',
};

const productTypeForPaymentMethods = {
    pass: 'pass',
    ticket: 'ticket',
    cardRecharge: 'cardRecharge',
    mobileWallet: 'mobileWallet',
    electricityBill: 'electricityBill',
    ncmcCardRechargeX: 'ncmcCardRecharge',
};

const ACTIVE_TICKETS_TAB = 'ACTIVE_TICKETS_TAB';
const EXPIRED_TICKETS_TAB = 'EXPIRED_TICKETS_TAB';
const BYTS_INTO_MB = 1000000;

const passTypes = {
    magic: 'magic',
    route: 'route',
};
const productType = {
    magicPass: 'magicPass',
};

const paymentStatus = {
    success: 'SUCCESS',
    pending: 'PENDING',
};
const ticketStatus = {
    success: 'SUCCESS',
    pending: 'PENDING',
    unused: 'UNUSED',
    used: 'USED',
    expired: 'EXPIRED',
    failed: 'FAILED',
    rejected: 'REJECTED',
    unverified: 'UNVERIFIED',
    verified: 'VERIFIED',
    paymentFailed: 'PAYMENT_FAILED',
    processing: 'PAYMENT_PROCESSING',
};

const ActionTypesPremiumTickets = {
    CANCEL_RIDE: 'CANCEL_RIDE',
    RESCHEDULE_RIDE: 'RESCHEDULE_RIDE',
    FIND_MY_STOP: 'FIND_MY_STOP',
    CHAT_SUPPORT: 'CHAT_SUPPORT',
    CALL_SUPPORT: 'CALL_SUPPORT',
};

const documentTypeStatus = {
    invalid: 'invalid',
};

const documentTypeId = {
    name: 'name',
};

const actionRequiredForTicket = {
    reinitiate: 'REINITIATE',
    reapply: 'REAPPLY',
};

const featureTextToOmitList = [
    'non-ac',
];

const mumbaiWebURL = process.env.REACT_APP_MUMBAI_WEB_URL;

const VOTE_FOR_NEXT_CITY_LINK = process.env.REACT_APP_VOTE_FOR_NEXT_CITY_LINK;

const RECLAIM_GOOGLE_FORM_URL = process.env.REACT_APP_RECLAIM_GOOGLE_FORM_URL;

const millisecondsInOneDay = process.env.REACT_APP_TIME_AFTER_ACTIVATION_ALLOW;

const OFFICE_TIME_WEEKDAYS = process.env.REACT_APP_OFFICE_TIME_WEEKDAYS;
const OFFICE_TIME_WEEKEND = process.env.REACT_APP_OFFICE_TIME_WEEKEND;

const sendEmail = () => {
    window.location.assign(process.env.REACT_APP_CONTACT_MAIL);
};

const transportationMod = {
    bus: 'BUS',
};
const encryptDecryptKeyForAuth = '5GO50jlU0a';

const remoteConfig = {
    branding: {
        MUMBAI: {
            onboardingScreen: {
                centerImageURL: OnBoardingMumbaiImage,
                centerImageText: 'Make your everyday travel better on BEST buses',
                footerImageURL: BestFastMumbaiImage,
                backgroundColor: '',
                imageHeight: 97,
                imageWidth: 88,
                isVisible: true,
            },
            homeFooterCard: {
                text: 'Make your everyday travel better on BEST buses',
                imageURL: OnBoardingMumbaiImage,
                navigationURL: 'https://chalo.com/inapp/partners/mumbai',
                backgroundColor: '',
                imageHeight: 51,
                imageWidth: 46,
                isVisible: true,
            },
        },
        ROURKELA: {
            onboardingScreen: {
                centerImageURL: BrandingRourkelImage,
                centerImageText: '',
                footerImageURL: BestFastRourkelaImage,
                backgroundColor: '',
                imageHeight: 190,
                imageWidth: 190,
                isVisible: true,
            },
            homeFooterCard: {
                text: 'Make your everyday travel better on Mo buses',
                imageURL: OnBoardingRourkelaImage,
                navigationURL: 'https://chalo.com/inapp/partners/rourkela',
                backgroundColor: '',
                imageHeight: 51,
                imageWidth: 39,
                isVisible: true,
            },
        },
    },
};

const mixpanelEvent = {
    appOpen: 'pwa app Open',
    chaloTimefetched: 'pwa chalo time fetched',
    homeScreenProductionHookClicked: 'pwa home screen production hook clicked',
    productSelect: 'pwa product selected',
    documetSubmitForVerification: 'pwa document submit for verification',
    productMakePaymentClicked: 'pwa product make payment clicked',
    routeScreenOpened: 'pwa route screen opened',
    historyButtonClick: 'pwa history button clicked',
    historyBookingItemClick: 'pwa history booking item clicked',
    startTripClick: 'pwa start trip clicked',
    toneScreenOpened: 'pwa tone screen opened',
    tonePlayed: 'pwa tone played',
    toneStoped: 'pwa tone stopped',
    toneResumed: 'pwa tone resumed',
    qrScreenOpened: 'pwa qr screen opened',
    ticketRouteSelect: 'pwa ticketing route selected',
    ticketRouteSelectUsingLink: 'pwa ticketing route selected using link',
    ticketFirstStopSelect: 'pwa ticketing first stop selected',
    ticketLastStopSelect: 'pwa ticketing last stop selected',
    ticketSelectionNextButtonClick: 'pwa ticketing selection screen next clicked',
    ticketFareFetch: 'pwa ticketing fares fetched',
    tripDetailsScreenShown: 'pb trip details screen shown',
    sourceSearchIntitiated: 'pb source search intitiated',
    destinationSearchIntitiated: 'pb destination search intitiated',
    sourceSelected: 'pb source selected',
    destinationSelected: 'pb destination selected',
    tripDetailsSubmitted: 'pb trip details submitted',
    rebookCardClicked: 'pb rebook card clicked',
    pickupDropOptionsFetched: 'pwa pb pickup Drop Options Fetched',
    noRouteErrorDisplayed: 'pwa pb no route error displayed',
    pickupDropSelected: 'pwa pb pickup Drop selected',
    timeSlotsFetched: 'pwa pb available slots fetched result success',
    timeSlotsNotFetched: 'pwa pb available slots fetched result failed',
    noSlotAvailable: 'pwa pb available slots fetched result no slots',
    selectedSlot: 'pwa pb slot selected by user',
    homeCardClick: 'pwa pb home card ticket click',
    trackBusClicked: 'pwa pb track bus clicked',
    verifyTicketClicked: 'pwa pb verify ticket clicked',
    activeBookingOptionsClicked: 'pwa pb active booking options clicked',
    activeBookingOptionItemClicked: 'pwa pb active booking option item clicked',
    bookingCancellationSuccessful: 'pwa pb booking cancellation successful',
    bookingOptionSelected: 'pwa pb booking option selected',
    bookingConfirmed: 'pwa pb booking confirmed',
    tripDetailsScreenShownAR: 'pwa ae trip details screen shown',
    sourceSearchIntitiatedAR: 'pwa ae source search intitiated',
    destinationSearchIntitiatedAR: 'pwa ae destination search intitiated',
    sourceSelectedAR: 'pwa ae source selected',
    destinationSelectedAR: 'pwa ae destination selected',
    tripDetailsSubmittedAR: 'pwa ae trip details submitted',
    rebookCardClickedAR: 'pwa ae rebook card clicked',
    pickupDropOptionsFetchedAR: 'pwa ae pickup Drop Options Fetched',
    noRouteErrorDisplayedAR: 'pwa ae no route error displayed',
    pickupDropSelectedAR: 'pwa ae pickup Drop selected',
    timeSlotsFetchedAR: 'pwa ae available slots fetched result success',
    timeSlotsNotFetchedAR: 'pwa ae available slots fetched result failed',
    noSlotAvailableAR: 'pwa ae available slots fetched result no slots',
    selectedSlotAR: 'pwa ae slot selected by user',
    homeCardClickAR: 'pwa ae home card ticket click',
    trackBusClickedAR: 'pwa ae track bus clicked',
    verifyTicketClickedAR: 'pwa ae verify ticket clicked',
    activeBookingOptionsClickedAR: 'pwa ae active booking options clicked',
    activeBookingOptionItemClickedAR: 'pwa ae active booking option item clicked',
    bookingCancellationSuccessfulAR: 'pwa ae booking cancellation successful',
    bookingOptionSelectedAR: 'pwa ae booking option selected',
    bookingConfirmedAR: 'pwa ae booking confirmed',
    routeDetailsReserveSeatBtnClicked: 'route details reserve seat btn clicked',
    searchScreenOpened: 'search screen opened',
    SearchResultsShown: 'Search results shown',
    searchResultClicked: 'search result clicked',
    destinationSearchInitiated: 'destination search initiated',
    pbBookingCardExpired: 'pb booking card expired ',
    firstrideAirportexpress: 'firstride_airportexpress_web',
    firstrideNonAirportexpress: 'firstride_non_airportexpress_web',
    bookingAirportexpress: 'booking_airportexpress_web',
    bookingNonAirportexpress: 'booking_non_airportexpress_web',
    airport_express_plan_purchased: 'airport_express_plan_purchased',
    userLallaploozaFormDetails: 'form submitted',
    landingScreenProductSelected: 'pwa_pb_plan_selected',
    pb_welcome_offer_purchased: 'pwa_pb_welcome_offer_purchased',
    pb_subscription_20_rides_purchased: 'pwa_pb_subscription_20_rides_purchased',
    pb_subscription_45_rides_purchased: 'pwa_pb_subscription_45_rides_purchased',
    passBooked: 'pass Booked',
    landingScreenOpen: 'pwa products landing screen shown',
    loginFailed: 'login failed',
    loginSuccessful: 'login successful',
    loginOtpRequestFailed: 'login otp request failed',
    loginScreenDisplayed: 'login screen displayed',
    loginOtpScreenDisplayed: 'login otp screen displayed',
    PwaWelcomeOfferAlreadyPurchased: 'PwaWelcomeOfferAlreadyPurchased',
    passBookedLandingScreen: 'pass booked ',
};

const PassUsageOptions = {
    PREMIUM: 'PREMIUM',
    // PREMIUM_BUS: 'PREMIUM_BUS',
};

const SlotTicketOptions = {
    SOLD_OUT: 'SOLD_OUT',
    FEW_SEATS_LEFT: 'FEW_SEATS_LEFT',
};

const TripStatus = {
    PLANNED: 'PLANNED',
    ACTIVE: 'ACTIVE',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED',
};

const bookingStatus = {
    ACTIVE: 'ACTIVE',
    PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    USED: 'USED',
    USER_CANCELLED: 'USER_CANCELLED',
    SYSTEM_CANCELLED: 'SYSTEM_CANCELLED',
    USER_RESCHEDULED: 'USER_RESCHEDULED',
    SYSTEM_RESCHEDULED: 'SYSTEM_RESCHEDULED',
    EXPIRED: 'EXPIRED',
    PUNCHED: 'PUNCHED',
};

const AdjustEventNames = {
    ticket: 'ticket',
    pass: 'pass',
    cardRecharge: 'cardRecharge',
    login: 'login',
    booking_airportexpress_web: 'booking_airportexpress_web',
    booking_non_airportexpress_web: 'booking_non_airportexpress_web',
    firstride_airportexpress_web: 'firstride_airportexpress_web',
    firstride_non_airportexpress_web: 'firstride_non_airportexpress_web',
};

export {
    validationForOTP,
    OtpLength,
    UiRoutes,
    formName,
    enums,
    formId,
    contentType,
    listIds,
    labelPaths,
    urls,
    dateFormat,
    timeFormat,
    timeFormat12,
    dateFormatWithHour,
    dateFormatWithSlash,
    dateFormatStartsWithYear,
    dateFormatStartsWithYearHour,
    dateFormatStartsWithYearSeconds,
    dateFormatWithMonthNameFullYear,
    dateFormatWithHalfMonthNameFullYear,
    schedulerDataDateFormat,
    ticketDataDateFormat,
    usedOnFormat,
    mimeType,
    responseType,
    dateFormatWith12Hour,
    emailValidatorPattern,
    alphabetsWithSpacesPattern,
    dateFormatWithMonthName,
    ACTIVE_TICKETS_TAB,
    EXPIRED_TICKETS_TAB,
    sixDigitOtpPattern,
    CRUD_IDS,
    REDUX_STORE_IDS,
    ServerErrorCodes,
    BYTS_INTO_MB,
    passTypes,
    paymentStatus,
    ticketStatus,
    productType,
    VOTE_FOR_NEXT_CITY_LINK,
    sendEmail,
    featureTextToOmitList,
    mumbaiWebURL,
    source,
    transportationMod,
    millisecondsInOneDay,
    actionRequiredForTicket,
    RECLAIM_GOOGLE_FORM_URL,
    OFFICE_TIME_WEEKDAYS,
    OFFICE_TIME_WEEKEND,
    numberValidation,
    documentTypeStatus,
    documentTypeId,
    encryptDecryptKeyForAuth,
    mixpanelEvent,
    remoteConfig,
    cardValidation,
    digitAllow,
    productTypeForPaymentMethods,
    chaloCardDateFormat,
    chaloCardTicketFormat,
    numberValidationWithDot,
    numberValidationWithSpace,
    ActionTypesPremiumTickets,
    PassUsageOptions,
    SlotTicketOptions,
    TripStatus,
    bookingStatus,
    premiumBusTimeFormat,
    AdjustEventNames,
    airportTravelPlan,
};