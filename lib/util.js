/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
import {
    find,
    get,
    set,
    sortBy,
    upperFirst,
} from 'lodash';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import toLower from 'lodash/toLower';
import lowerCase from 'lodash/lowerCase';
import isObject from 'lodash/isObject';
import filter from 'lodash/filter';
import i18next from 'i18next';
import Events from './events';
import IndexDB, {
    objectStoreIndexKeys,
    objectStoreKeys,
} from './indexedDB';
import timeZoneInstance from './timezone';
import {
    dateFormatWithHalfMonthNameFullYear,
    ticketStatus,
    encryptDecryptKeyForAuth,
    bookingStatus,
    PassUsageOptions,
    airportTravelPlan,
} from './constants';
import ChaloTime from './chaloTime';
import {
    Overcrowded,
    SeatsAvailable,
    StandingAvailable
} from '../Images';
import BlankSpace from '../components/Icons/BlankSpace';

const typeExtractor = (fileTypeCheck) => {
    let fileType = null;
    if (fileTypeCheck) {
        const type = toLower(fileTypeCheck);
        if (type.indexOf('pdf') > -1) {
            fileType = 'PDF';
        } else if (type.indexOf('jpeg') > -1) {
            fileType = 'JPEG';
        } else if (type.indexOf('jpg') > -1) {
            fileType = 'JPG';
        } else if (type.indexOf('png') > -1) {
            fileType = 'PNG';
        }
    }
    return fileType;
};

function retry(
    fn,
) {
    return new Promise((resolve) => {
        fn()
            .then(resolve)
            .catch(() => {
                window.location.reload();
            });
    });
}
const getTimeZoneDiffInMillis = (timezone) => {
    const now = momentTimezone();
    const localOffset = now.utcOffset();
    now.tz(timezone); // your time zone, not necessarily the server's
    const centralOffset = now.utcOffset();
    const diffInMilis = (centralOffset - localOffset) * 60 * 1000;
    return diffInMilis;
};

const getDate = (date) => {
    const timeZoneDiff = getTimeZoneDiffInMillis(timeZoneInstance.getTimeZone());
    if (date || date === 0) {
        const dateTimestamp = new Date(date).getTime();
        return new Date(dateTimestamp + timeZoneDiff);
    }
    return new Date(Date.now() + timeZoneDiff);
};

const getMoment = (date) => {
    const timeZoneDiff = getTimeZoneDiffInMillis(timeZoneInstance.getTimeZone());
    if (date || date === 0) {
        const dateTimestamp = new Date(date).getTime();
        return moment(dateTimestamp + timeZoneDiff);
    }
    return moment(Date.now() + timeZoneDiff);
};
const getTimestamp = (date) => {
    const timeZoneDiff = getTimeZoneDiffInMillis(timeZoneInstance.getTimeZone());
    if (date) {
        const dateTimestamp = new Date(date).getTime();
        return dateTimestamp + timeZoneDiff;
    }
    return Date.now() + timeZoneDiff;
};

function getTimeString(yearsInt, monthsInt, weeksInt, daysInt) {
    const years = parseInt(yearsInt || 0, 10);
    const months = parseInt(monthsInt || 0, 10);
    const weeks = parseInt(weeksInt || 0, 10);
    const days = parseInt(daysInt || 0, 10);
    let timeString = '';
    if (years > 1) {
        timeString = `${years} years`;
    } else if (years > 0) {
        timeString = `${years} year`;
    }

    if (months > 1) {
        timeString += ` ${months} months`;
    } else if (months > 0) {
        timeString += ` ${months} month`;
    }

    if (weeks > 1) {
        timeString += ` ${weeks} weeks`;
    } else if (weeks > 0) {
        timeString += ` ${weeks} week`;
    }

    if (days > 1) {
        timeString += ` ${days} days`;
    } else if (days > 0) {
        timeString += ` ${days} day`;
    }
    return timeString.trim();
}

const isInputExistInMap = (input, itemsKeys, item = {}) => {
    const mapKeys = itemsKeys || Object.keys(item || {});
    let isExist = false;
    // eslint-disable-next-line no-unused-expressions
    mapKeys ? .some((ele, index) => {
        if (lowerCase(item[mapKeys[index]]).indexOf(lowerCase(input)) > -1) {
            isExist = true;
        }
        return true;
    });
    return isExist;
};

const getName = (fName, mName, lName) => {
    const name = [];
    if (fName) {
        name.push(fName);
    }
    if (mName) {
        name.push(mName);
    }
    if (lName) {
        name.push(lName);
    }
    return name.join(' ');
};

const getString = (data) => {
    const name = [];
    // eslint-disable-next-line no-unused-expressions
    data ? .forEach((item) => {
        if (item) {
            name.push(item);
        }
    });
    return name.join(' ');
};

const getPlaceString = (data) => {
    const placeString = data ? .split(',');
    placeString ? .shift();
    return placeString ? .join(',');
};

const getStopPlaceList = (data, searchData) => {
    const searchText = searchData ? .toLowerCase();
    const stopsList = data ? .stops || [];
    const placesList = data ? .places || [];
    const resultsList = [];
    const exactLocList = [];
    const prefixMatchList = [];
    const secondaryStopList = [];
    const stopPrefixMatch = [];
    const locList = [];

    placesList ? .forEach((item) => {
        const title = item ? .description ? .split(',') ? .[0] ? .trim();
        if (title ? .toLowerCase() === searchText) {
            exactLocList.push(item);
        } else if (item ? .description ? .toLowerCase() ? .startsWith(searchText)) {
            prefixMatchList.push(item);
        } else {
            locList.push(item);
        }
    });

    stopsList ? .forEach((item) => {
        if (item ? .stop_name ? .toLowerCase() === searchText) {
            exactLocList.push(item);
        } else if (item ? .stop_name ? .toLowerCase() ? .startsWith(searchText)) {
            stopPrefixMatch.push(item);
        } else {
            secondaryStopList.push(item);
        }
    });
    resultsList.push(...exactLocList,
        ...stopPrefixMatch,
        ...prefixMatchList,
        ...secondaryStopList,
        ...locList);

    return resultsList;
};

const getIsStopInsideCity = (center, bound) => {
    if (center && bound) {
        const bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(bound ? .lat1, bound ? .lon1),
            new window.google.maps.LatLng(bound ? .lat2, bound ? .lon2),
        );
        const locationInCity = bounds ? .contains(center);
        return locationInCity;
    }
    return false;
};

const typeObj = {
    jpg: 'image/jpg',
    jpeg: 'image/jpeg',
    png: 'image/png',
};

const contentTypeCalculator = (imageType) => {
    if (!imageType) return false;
    const type = imageType.toLowerCase();
    return typeObj[type] || type;
};

const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = (`${phoneNumberString}`).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        const intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return phoneNumberString;
};

const getInitials = (name) => {
    if (Array.isArray(name)) {
        // eslint-disable-next-line no-param-reassign
        name = getString(name);
    }

    const initials = name.replace(/[^a-zA-Z- ]/g, '').match(/\b\w/g);

    if (name) {
        return initials.join('').toUpperCase();
    }

    return initials;
};

const encodeUserSettings = (filters = {}) => {
    let parsedFilter = filters;
    if (typeof filters === 'string') {
        try {
            parsedFilter = JSON.parse(filters);
        } catch (settingsParseError) {
            console.error('encodeUserSettings | settingsParseError', settingsParseError);
            return filters;
        }
    }
    parsedFilter.lastModified = moment().unix();
    return JSON.stringify(parsedFilter);
};

const decodeUserSettings = (settings, encode = false) => {
    if (!settings) return encode ? '' : {};
    let parsedFilter = {};
    if (typeof settings === 'string') {
        try {
            parsedFilter = JSON.parse(settings);
        } catch (settingsParseError) {
            console.error('decodeUserSettings | settingsParseError', settingsParseError);
            return encode ? '' : {};
        }
    } else parsedFilter = { ...settings
    };
    if (encode) {
        delete parsedFilter.lastModified;
        return Object.entries(parsedFilter).filter(([, val]) => val && val !== 'undefined').map(([key, val]) => {
            if (Array.isArray(val)) {
                return [key, window.escape(val.join(','))].join('=');
            }
            return [key, val].map(window.escape).join('=');
        }).join('&');
    }
    return parsedFilter;
};

const parse = (stringSequence) => {
    try {
        return JSON.parse(stringSequence);
    } catch (err) {
        console.error(err);
        return {};
    }
};

const extractNumber = (number) => {
    const numberPattern = /\d+/g;
    return number ? .toString().trim().match(numberPattern).join('');
};

const isAuthorized = (roles) => {
    let loggedInUserRole = null;
    try {
        const {
            roleName
        } = JSON.parse(localStorage.getItem('user') || '{}');
        loggedInUserRole = (roleName || '').toLowerCase();
    } catch {
        return false;
    }
    if (loggedInUserRole) {
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return rolesArray.some((role) => role === loggedInUserRole);
    }
    return false;
};

const urltoFile = (url, filename, mimeType) => {
    // eslint-disable-next-line no-param-reassign
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buf) => new File([buf], filename, {
            type: mimeType
        }))
    );
};
const getRandomNumber = () => {
    const crypto = window.crypto || window.msCrypto || {
        getRandomValues: () => [1.11]
    };
    const array = new Uint32Array(1);
    crypto.getRandomValues(array); // Compliant for security-sensitive use cases
    return array[0];
};

const JArray = JSON.parse('[{"Key": "Prompt1", "Type": "DropDown", "Lable": "J-code", "Order": "1", "Default": "", "Options": [{"Units": "1", "Dosage": "1.25 mg", "J-code": "J9035", "Abbreviation": "IVA", "Medication name": "Avastin"}, {"Units": "3", "Dosage": "0.3 mg", "J-code": "J2778", "Abbreviation": "IVL", "Medication name": "Lucentis"}, {"Units": "4", "Dosage": "4 mg", "J-code": "J3301", "Abbreviation": "IVK", "Medication name": "Kenalog"}, {"Units": "2", "Dosage": "2 mg", "J-code": "J0178", "Abbreviation": "?", "Medication name": "Eylea"}, {"Units": "19", "Dosage": "0.19 mg", "J-code": "J7313", "Abbreviation": "?", "Medication name": "Illuvien"}, {"Units": "1", "Dosage": "0.125 mg", "J-code": "J7316", "Abbreviation": "?", "Medication name": "Jetrea"}, {"Units": "7", "Dosage": "0.7 mg", "J-code": "J7312", "Abbreviation": "?", "Medication name": "Ozurdex"}, {"Units": "40", "Dosage": "4 mg", "J-code": "J3300", "Abbreviation": "?", "Medication name": "Triesence"}], "IsNested": "0"}, {"Key": "Prompt2", "Type": "TextBox", "Lable": "Lot #", "Order": "2", "Default": "", "Options": [], "IsNested": "0"}, {"Key": "Prompt3", "Type": "TextBox", "Lable": "Expiration", "Order": "3", "Default": "", "Options": [], "IsNested": "0"}, {"Key": "Prompt4", "Type": "TextBox", "Lable": "Dosage", "Order": "4", "Default": "", "Options": [], "IsNested": "0"}, {"Key": "Prompt5", "Type": "TextBox", "Lable": "Units", "Order": "5", "Default": "", "Options": [], "IsNested": "0"}]');

const crudSelector = (state, id, type) => {
    if (!id) {
        return null;
    }
    if (state.crud) {
        if (state.crud.get('currentTab')) {
            return state.crud.get(state.crud.get('currentTab')) && state.crud.get(state.crud.get('currentTab'))
                .get(id) && state.crud.get(state.crud.get('currentTab'))
                .get(id)
                .get(type);
        }
        return state.crud.get(id) && state.crud.get(id).get(type);
    }
    return true;
};

const closeAppDrawer = () => {
    Events.trigger('toggleAppDrawer', false);
};

const openAppDrawer = () => {
    Events.trigger('toggleAppDrawer', true);
};

const showSnackbar = (message) => {
    Events.trigger('showSnackbar', message);
};

let deviceId = '';

const setDeviceId = (id) => {
    deviceId = id;
};

const getDeviceId = () => deviceId;
// const getDeviceId = () => 'a12b34c56d78e91f';

const validateFileSize = (fileSize) => {
    if (fileSize / 1000000 > 5) {
        return true;
    }
    return false;
};

const authAPI = {
    getAuth: async () => {
        try {
            return await IndexDB(objectStoreKeys.auth).getAll(encryptDecryptKeyForAuth);
        } catch (err) {
            console.log('err >>>>', err);
            return {};
        }
    },
    getAuthByKey: (key) => IndexDB(objectStoreKeys.auth).get(key),
    setAuth: (key, val) => IndexDB(objectStoreKeys.auth).set(key, val, encryptDecryptKeyForAuth),
};

const isPassOrTicketAvailable = (pass) => {
    if (pass ? .productType === 'singleJourneyTicket' || pass ? .isTicket) return true;
    if ((pass ? .productType ? .toLowerCase() === 'magicpass' ||
            pass ? .productType ? .toLowerCase() === 'pass' || pass.productType ? .toLowerCase() === 'superpass')) return true;
    return false;
};

const getKeyForEncryptAndDecrypt = (userId) => {
    if (userId) {
        let first = '';
        let second = '';
        for (let index = 0; index < userId.length; index += 2) {
            first += userId[index];
            second = userId[index + 1] + second;
        }
        const key = first + second;
        return key;
    }
    return '';
};

const getIsActivationWindowExpired = (ticketInfo = {}, chaloTime) => {
    const lastActivationTime = ticketInfo ? .rideCount ? .
        [ticketInfo ? .rideCount ? .length - 1] ? .punchingTime;
    const activeDuration = get(ticketInfo, ['activeDuration']) || process.env.REACT_APP_PASS_ACTIVATION_DURATION;
    if (!lastActivationTime) {
        return true;
    }
    if ((chaloTime - lastActivationTime) >= activeDuration) {
        return true;
    }
    return false;
};

const getIsExpired = (pass = {}, chaloTime) => {
    const {
        expiryTime
    } = pass;
    if (pass ? .isTicket) {
        return !!(pass.isExpired || (expiryTime - (chaloTime ? ? new Date().getTime()) <= 0));
    }
    const expiryDate = moment(expiryTime).toDate();
    return moment(expiryDate).diff(moment(chaloTime ? ? new Date().getTime()), 'minutes') <= 0;
};

const syncPassesWithLocalDb = (
    historyResponseData,
    productDataFromConfig,
    transId,
    currencySymbol = '₹',
    syncNew = false,
) => new Promise((resolve) => {
    const allNewItems = [
        ...(historyResponseData ? .passes ? ? []),
        ...(historyResponseData ? .ticket ? ? []),
        ...(historyResponseData ? .recentTransactions ? ? []),
        ...(historyResponseData ? .passApplications ? ? []),
        ...(historyResponseData ? .mobileTicket ? .filter((ticket) => ticket ? .productSubType !== 'instantTicket') ? ? []),
    ];
    const productData = ([
        ...historyResponseData ? .configuration ? .products ? ? [],
        ...productDataFromConfig,
    ] ? ? []);
    const objectOfNewItem = {};
    const {
        get,
        set,
        getAllFromIndex,
        del,
    } = IndexDB(
        objectStoreKeys.myPassHistory,
    );
    const {
        get: getCached,
        set: setCached,
    } = IndexDB(
        objectStoreKeys.cachedPassData,
    );
    (async () => {
        try {
            const {
                getAuth
            } = authAPI;
            const AuthData = await getAuth();
            const userId = filter(AuthData, 'userId') ? .[0] ? .userId;
            const phoneNumber = filter(AuthData, 'phoneNumber') ? .[0] ? .phoneNumber;
            const city = filter(AuthData, 'city') ? .[0] ? .city ? .toLowerCase();
            const getChaloTime = filter(AuthData, 'chaloTime') ? .[0] ? .chaloTime;
            const encryptDecryptKey = getKeyForEncryptAndDecrypt(phoneNumber);
            const chaloTime = getChaloTime ?
                getTimestamp() - getChaloTime.anchorTime + getChaloTime.serverTime : getTimestamp();
            if (userId && city) {
                if (allNewItems ? .length && productData) {
                    await Promise.all(allNewItems.map(async (passData) => {
                        if (passData ? .ticketId || passData.bookingId) {
                            passData.transactionId = passData ? .ticketId || passData.bookingId;
                            passData.isTicket = true;
                            passData.displayName = 'Single journey Ticket';
                            passData.ticketCardTitle = 'One way ticket';
                            passData.userProfile = {
                                userId,
                            };
                            if (passData ? .productSubType === 'premiumReserveTicket') {
                                passData.premiumReserveTicket = true;
                                passData.ticketCardTitle = 'One Way Booking';
                                passData.displayName = 'One Way Booking';
                            }
                        }
                        if (!passData ? .transactionId) {
                            passData.transactionId = `${passData?.userProfile?.userId}-${
                passData?.city?.toLowerCase()}-${
                passData?.agency}-${
                passData?.categoryId}`;
                        }
                        objectOfNewItem[passData ? .transactionId] = 1;
                        if (!transId || transId === passData ? .transactionId) {
                            if (isPassOrTicketAvailable(passData)) {
                                const product = productData ? .filter(
                                    (item) => item ? .id === passData ? .configurationId,
                                ) ? .[0];

                                const category = product ? .categories ? .filter(
                                    (categoryData) => categoryData ? .id === (passData ? .passengerType ||
                                        passData ? .categoryId),
                                ) ? .[0];

                                const fareMapping = product ? .fareMapping ? .[passData ? .passengerType ||
                                    passData ? .categoryId
                                ] ? .filter(
                                    (fareData) => (passData ? .fmId === fareData ? .fmId ||
                                        (passData ? .fare ? .toString() === fareData ? .fare ? .toString() &&
                                            fareData ? .durationId ? .toString() ===
                                            (passData ? .numOfDays * 24 * 60 * 60 * 1000) ? .toString())),
                                ) ? .[0];

                                let newPass = {
                                    ...passData,
                                    city: passData ? .city ? .toLowerCase(),
                                    desc: fareMapping ? .desc,
                                    conditions: product ? .terms,
                                };

                                if (fareMapping ? .subCatId) {
                                    const subCategory = product ? .subCategory ? .filter(
                                        (subCategoryData) => subCategoryData ? .id === fareMapping ? .subCatId,
                                    ) ? .[0];
                                    newPass = {
                                        ...newPass,
                                        infoNote: subCategory ? .infoNote,
                                    };
                                }
                                if (!passData ? .specialFeatures ? .length) {
                                    newPass = {
                                        ...newPass,
                                        specialFeatures: fareMapping ? .specialFeatures,
                                    };
                                }

                                // get pass from new db userPassCache
                                let cachedPass = await getCached(
                                    newPass ? .transactionId ? newPass ? .transactionId : '',
                                    encryptDecryptKey,
                                );
                                // handle punch time merging logic here below
                                if (!cachedPass) {
                                    cachedPass = {
                                        transactionId: newPass ? .transactionId,
                                        oldestHistoryCallTimeStamp: chaloTime,
                                    };
                                } else if (!cachedPass ? .oldestHistoryCallTimeStamp) {
                                    // save below to userPassCache db
                                    cachedPass = {
                                        ...cachedPass,
                                        oldestHistoryCallTimeStamp: chaloTime,
                                    };
                                }
                                cachedPass.activeDuration = product ? .activeDuration;
                                const passPunches = newPass ? .punches || [];

                                const cachedPassCount = [...passPunches];
                                if (newPass ? .punches ? .length && !cachedPass ? .premiumReserveTicket) {
                                    if (cachedPass ? .rideCount ? .length) {
                                        let maxTimeStamp = 0;
                                        // eslint-disable-next-line no-plusplus
                                        for (let i = 0; i < newPass.punches.length; i++) {
                                            if (newPass.punches[i].punchingTime > maxTimeStamp) {
                                                maxTimeStamp = newPass.punches[i].punchingTime;
                                            }
                                        }
                                        // eslint-disable-next-line no-plusplus
                                        for (let index = 0; index < cachedPass.rideCount.length; index++) {
                                            if (cachedPass.rideCount[index].punchingTime > maxTimeStamp &&
                                                cachedPass.rideCount[index].punchingTime + 86400000 >
                                                (chaloTime)) {
                                                cachedPassCount.push({
                                                    punchingTime: cachedPass.rideCount[index] ? .punchingTime,
                                                });
                                            }
                                        }
                                    }
                                    cachedPass.rideCount = sortBy(cachedPassCount, (o) => o ? .punchingTime);
                                } else if (cachedPass ? .rideCount ? .length) {
                                    const rideCountPunchesData = cachedPass ? .rideCount ?
                                        .filter((data) => data.punchingTime + 86400000 > (chaloTime));
                                    cachedPass.rideCount = sortBy(rideCountPunchesData, (o) => o ? .punchingTime);
                                }
                                if (!cachedPass.isExpired &&
                                    cachedPass.rideCount &&
                                    getIsActivationWindowExpired(cachedPass, chaloTime) &&
                                    getIsExpired(cachedPass, chaloTime) &&
                                    passData.isTicket) {
                                    cachedPass.isExpired = true;
                                }
                                await setCached(undefined, cachedPass, encryptDecryptKey);

                                const pass = await get(
                                    newPass ? .transactionId ? newPass ? .transactionId : '',
                                    encryptDecryptKey,
                                );

                                if (!pass ? .fareInfo && !passData ? .fareInfo) {
                                    const fare = {
                                        fare: passData ? .fare,
                                        discountedFare: passData ? .discountedFare,
                                    };
                                    const fareBreakup = [{
                                        name: 'Pass price',
                                        value: currencySymbol + fare ? .fare,
                                    }];

                                    if (fare ? .discountedFare && (fare ? .discountedFare !== fare ? .fare)) {
                                        fareBreakup.push({
                                            name: 'Discount',
                                            value: currencySymbol + (fare ? .fare - fare ? .discountedFare),
                                        }, );
                                    }
                                    const fareInfo = {
                                        actualFare: fare ? .fare,
                                        discountedFare: fare ? .discountedFare,
                                        payableAmount: fare ? .discountedFare || fare ? .fare,
                                        fareBreakup,
                                    };
                                    newPass.productName = product ? .name;
                                    newPass.displayName = fareMapping ? .displayName || product ? .name;
                                    newPass.categoryId = category ? .id;
                                    newPass.categoryName = category ? .name;
                                    newPass.fareInfo = fareInfo;
                                } else {
                                    newPass.productName = passData ? .productName || pass ? .productName;
                                    newPass.displayName = passData ? .displayName || pass ? .displayName;
                                    newPass.categoryId = passData ? .categoryId || pass ? .categoryId;
                                    newPass.categoryName = passData ? .categoryName || pass ? .categoryName;
                                    newPass.fareInfo = passData ? .fareInfo || pass ? .fareInfo;
                                }

                                if (!newPass ? .bookingTime) {
                                    newPass.bookingTime = Number(passData ? .passStartDate || getDate());
                                }
                                await set(undefined, { ...pass,
                                    ...newPass,
                                    ...cachedPass
                                }, encryptDecryptKey);
                            }
                        }
                    }));
                }
                const myPasses = await getAllFromIndex(
                    objectStoreIndexKeys.myPassHistory.userId_city,
                    IDBKeyRange.only([userId, city]),
                    encryptDecryptKey,
                );
                const newMyPasses = [];
                for (let index = 0; index < myPasses.length; index += 1) {
                    const pass = myPasses[index];
                    if (objectOfNewItem[pass.transactionId] !== 1 && !syncNew) {
                        try {
                            del(pass.transactionId);
                        } catch (err) {
                            //
                        }
                    } else {
                        newMyPasses.push(pass);
                    }
                }
                resolve(newMyPasses || []);
            }
            resolve([]);
        } catch (err) {
            console.error(err);
            resolve([]);
        }
    })();
});

const syncRideHistoryWithLocalDb = (
    rideHistoryResponseData,
) => new Promise((resolve) => {
    const {
        set,
    } = IndexDB(
        objectStoreKeys.rideReceipt,
    );
    (async () => {
        try {
            const {
                getAuth
            } = authAPI;
            const AuthData = await getAuth();
            const userId = filter(AuthData, 'phoneNumber') ? .[0] ? .phoneNumber;
            const encryptDecryptKey = getKeyForEncryptAndDecrypt(userId);
            const dataAddInDatabase = { ...rideHistoryResponseData ? .passTripHistory
            };
            dataAddInDatabase.transactionId = rideHistoryResponseData ? .passTripHistory ? .passId;
            await set(undefined, { ...dataAddInDatabase
            }, encryptDecryptKey);
            resolve(dataAddInDatabase);
        } catch (err) {
            console.error(err);
            resolve([]);
        }
    })();
});

const getCurrentChaloTime = (chaloTime) => getTimestamp() - chaloTime ? .anchorTime +
    chaloTime ? .serverTime;

const getTimeElapsedSince2022 = () => {
    const startDate = 1640995200000;
    // 1577817000000
    // 1577836800000
    // 1577880000000;
    const chaloTime = ChaloTime.getTime();
    const currentChaloTIme = getCurrentChaloTime(chaloTime);
    const diffDate = currentChaloTIme - startDate;

    return {
        minutes: Math.floor(diffDate / (1000 * 60)),
        sec: Math.floor((getDate(currentChaloTIme).getSeconds()) / 8),
    };
};

const getExpiryTime = (expiryTime = getDate()) => moment(expiryTime);
const getPassStartTime = (startTime = getTimestamp()) => moment(startTime);

const getTicketStatus = (ticketInfo, isExpired = false, chaloTime = getTimestamp()) => {
    const {
        status,
        startTime,
        isTicket,
    } = ticketInfo;
    let {
        expiryTime = chaloTime
    } = ticketInfo;
    expiryTime = Number(expiryTime || ticketInfo ? .activationExpiryTime || chaloTime);
    if (status === bookingStatus.SYSTEM_CANCELLED || status === bookingStatus.USER_CANCELLED) {
        return i18next.t('magicPass.bookingCancelled');
    }
    if (status === bookingStatus.SYSTEM_RESCHEDULED || status === bookingStatus.USER_RESCHEDULED) {
        return i18next.t('magicPass.bookingRescheduled');
    }
    if (status === ticketStatus ? .failed || status === ticketStatus ? .paymentFailed) {
        return i18next.t('userTicketList.failed');
    }
    if (status === ticketStatus.unverified) {
        return i18next.t('userTicketList.verificationPending');
    }
    if (status === ticketStatus.rejected) {
        return i18next.t('userTicketList.verificationRejected');
    }
    if (status === ticketStatus.verified || status === ticketStatus ? .processing) {
        return i18next.t('userTicketList.pending');
    }
    if (startTime >= chaloTime) {
        return i18next.t('userTicketList.startFrom', {
            date: getPassStartTime(startTime).format(dateFormatWithHalfMonthNameFullYear)
        });
    }
    if (isExpired) {
        if (status === ticketStatus ? .pending) {
            return i18next.t('userTicketList.ExpiredOn', {
                date: getExpiryTime(expiryTime).format(dateFormatWithHalfMonthNameFullYear)
            });
        }
        if (status === ticketStatus ? .failed) {
            return i18next.t('userTicketList.failed');
        }
        if (ticketInfo ? .punchedAt) {
            return i18next.t('userTicketList.ExpiredOn', {
                date: getExpiryTime(ticketInfo ? .punchedAt).format(dateFormatWithHalfMonthNameFullYear)
            });
        }
        return i18next.t('userTicketList.ExpiredOn', {
            date: getExpiryTime(expiryTime).format(dateFormatWithHalfMonthNameFullYear)
        });
    }
    if (status === ticketStatus ? .pending) {
        return i18next.t('userTicketList.pending');
    }
    if (isTicket) {
        return i18next.t('userTicketList.TicketValidTill', {
            date: getExpiryTime(expiryTime).format(dateFormatWithHalfMonthNameFullYear)
        });
    }
    return i18next.t('userTicketList.validTill', {
        date: getExpiryTime(expiryTime).format(dateFormatWithHalfMonthNameFullYear)
    });
};

const getTodayRemainingTripBalance = (rideCount, chaloTime = getTimestamp()) => {
    let count = 0;
    rideCount ? .forEach((punches) => {
        if (punches ? .punchingTime >= moment(chaloTime).startOf('days').valueOf()) {
            count += 1;
        }
    });
    return count;
};

const getHoursAndMinutesFromSeconds = (seconds) => ({
    hours: Math.trunc(seconds / 60 / 60),
    minutes: Math.round((seconds / 60) % 60) <= 0 ? 1 : Math.round((seconds / 60) % 60),
});

const getStopFilterRoutes = (data) => {
    const currentTimeInSec = Math.floor((getTimestamp() - getDate().setHours(0, 0, 0, 0)) / 1000);
    const newData = data ? .filter((ele) => ele ? .arrival_time > currentTimeInSec);
    const filterData = data ? .filter((ele, ind) => ind === data ?
        .findIndex((elem) => elem ? .trip ? .route_id === ele ? .trip ? .route_id));
    const newArray = [];
    for (let j = 0; j < filterData.length; j++) {
        const index = newData.findIndex(
            (element) => filterData[j] ? .trip ? .route_id === element ? .trip ? .route_id,
        );
        if (index === -1) {
            newArray.push(filterData[j]);
        } else {
            newArray.push(newData[index]);
        }
    }
    return newArray;
};

const isETAAvailiable = (etaData, tripData) => etaData.find((el) => el ? .routeId ===
    tripData ? .trip ? .route_id);

const getEtaParsedData = (stopRouteIds = [], data) => {
    const parsedValuesList = [];
    const sortestETAForRoutes = {};
    const etaArray = [];
    if (data) {
        stopRouteIds ? .forEach((stop) => {
            if (Object.keys(data ?
                    .stopRouteEtas[stop] || {}).length) {
                Object.values(data ?
                    .stopRouteEtas[stop] || {}).forEach((item) => {
                    const parsedData = parse(item);
                    if (
                        parsedData ? .eta !== -1
                    ) {
                        etaArray.push(parsedData);

                        if ((moment().diff(moment(parsedData ? .tS), 'minutes') <= 15)) {
                            if (!sortestETAForRoutes[stop.split(':')[1]]) {
                                sortestETAForRoutes[stop.split(':')[1]] = parsedData;
                            } else if (sortestETAForRoutes[stop.split(':')[1]].eta > parsedData.eta) {
                                sortestETAForRoutes[stop.split(':')[1]] = parsedData;
                            }
                        }
                    }
                });
                if (sortestETAForRoutes[stop.split(':')[1]]) {
                    parsedValuesList.push({
                        number: sortestETAForRoutes[stop.split(':')[1]] ? .vNo,
                        stopId: stop.split(':')[0],
                        routeId: stop.split(':')[1],
                        timeStamp: sortestETAForRoutes[stop.split(':')[1]].tS,
                        eta: sortestETAForRoutes[stop.split(':')[1]].eta,
                    });
                }
            } else {
                etaArray.push({
                    dummy: ''
                });
            }
        });
    }

    return {
        parsedValuesList,
        etaArray
    };
};
const getTimeForBusArrival = (data, isWalkingTime = false, etaData = [], eta) => {
    const time = Math.floor((getTimestamp() - getDate().setHours(0, 0, 0, 0)) / 1000);

    if (eta || isETAAvailiable(etaData, data)) {
        const {
            hours,
            minutes,
        } = getHoursAndMinutesFromSeconds(
            eta || isETAAvailiable(etaData, data) ? .eta,
        );

        return hours ?
            i18next.t('estimateTimeArriving.inTimeHrMin', {
                hours,
                minutes,
            }) :
            (minutes > 1 ? i18next.t('estimateTimeArriving.inTimeMin', {
                    minutes
                }) :
                i18next.t('estimateTimeArriving.inTimeAMin'));
    }
    if (data ? .trip ? .ttStatus === 1 || data.ttStatus === 1) {
        return <span className = "frequency-prefix" > {
            i18next.t('tripPlannerCard.timing_not_available')
        } < /span>;
    }
    let timing;
    let count = 0;
    if (data ? .trip ? .isFrequencyTrip) {
        data ? .trip ? .frequency_data_array ? .forEach((item) => {
            if (item ? .start_time < time && item ? .end_time >= time) {
                timing = item ? .frequency;
            }
        });
        if (!timing) {
            data ? .trip ? .frequency_data_array ? .forEach((item) => {
                if (item ? .start_time > time && count === 0) {
                    timing = moment.utc(item ? .start_time * 1000).format('hh:mm A');
                    count += 1;
                }
            });
            if (!timing) {
                return <span className = "frequency-prefix" > {
                    i18next.t('tripPlannerCard.timing_not_available')
                } < /span>;
            }
            return ( <
                >
                <
                span className = "frequency-prefix" > {
                    i18next.t('tripPlannerCard.after')
                } < /span> {
                    timing
                } <
                />
            );
        }

        return (!isWalkingTime &&
            ( <
                >
                <
                span className = "frequency-prefix" > {
                    i18next.t('tripPlannerCard.everyTime')
                } <
                /span> {
                    ' '
                } {
                    timing
                } {
                    ' '
                }
                min <
                />
            )
        );
    }
    if (data ? .isFrequencyLeg) {
        return ( <
            span className = "frequency-prefix"
            style = {
                {
                    fontFamily: 'noto_sanssemibold',
                    fontSize: 14
                }
            } > {
                i18next.t('tripPlannerCard.every', {
                    timing: data ? .frequency,
                })
            } <
            /span>
        );
    }

    if (data ? .start_time) {
        const timeInMillis = data ? .start_time * 1000 + getDate().setHours(0, 0, 0, 0);
        return ( <
            span className = "frequency-prefix"
            style = {
                {
                    fontFamily: 'noto_sanssemibold',
                    fontSize: 14
                }
            } >

            {
                moment(getDate(timeInMillis)).format('hh:mm A')
            } <
            /span>
        );
    }
    return moment.utc(data ? .arrival_time * 1000).format('hh:mm A');
};
const isTimeTableAvailable = (data) => {
    if (data ? .trip ? .ttStatus === 1) {
        return false;
    }
    return true;
};

const getFrequencyAtTime = (currentTime, frequencyList) => {
    let returnValue = false;
    for (let i = 0; i < frequencyList ? .length; i++) {
        if (currentTime <= frequencyList[i] ? .end_time && currentTime >= frequencyList[i] ? .start_time) {
            returnValue = frequencyList[i];
            break;
        } else if (currentTime < frequencyList[i] ? .start_time) {
            returnValue = frequencyList[i];
            break;
        }
    }
    return returnValue;
};

const hasExpired = (data) => {
    const time = Math.floor((getTimestamp() - getDate().setHours(0, 0, 0, 0)) / 1000);
    return data ? .trip ? .isFrequencyTrip && getFrequencyAtTime(time, data ? .trip ? .frequency_data_array);
};

const getSortdBusses = (stopsData, stopRouteIds, nearestAllBusStopsETA) => {
    const arr = [...stopsData];
    const {
        parsedValuesList
    } = getEtaParsedData(stopRouteIds, nearestAllBusStopsETA);
    parsedValuesList ? .sort((item1, item2) => item2 ? .eta - item1 ? .eta);
    const data = parsedValuesList.filter(
        (v, i, a) => a.findIndex((v2) => (v2 ? .routeId === v ? .routeId)) === i,
    );

    arr ? .sort((a, b) => {
        if (!isTimeTableAvailable(a) && isTimeTableAvailable(b)) {
            return 1;
        }
        if (isTimeTableAvailable(a) && !isTimeTableAvailable(b)) {
            return -1;
        }
        if (hasExpired(a) && !hasExpired(b)) {
            return -1;
        }
        if (!hasExpired(a) && hasExpired(b)) {
            return 1;
        }
        if (hasExpired(a) && hasExpired(b)) {
            const time = Math.floor((getTimestamp() - getDate().setHours(0, 0, 0, 0)) / 1000);
            const frequencyA = getFrequencyAtTime(time, a ? .trip ? .frequency_data_array);
            const frequencyB = getFrequencyAtTime(time, b ? .trip ? .frequency_data_array);
            if (frequencyA ? .frequency === frequencyB ? .frequency) {
                if (a ? .trip ? .route_name > b ? .trip ? .route_name) {
                    return 1;
                }
                return -1;
            }
            if (frequencyA ? .frequency > frequencyB ? .frequency) {
                return 1;
            }
            return -1;
        }
        if (!hasExpired(a) && !hasExpired(b)) {
            if (moment.utc(a ? .arrival_time * 1000).format('hh:mm A') === moment.utc(b ? .arrival_time * 1000).format('hh:mm A')) {
                if (a ? .trip ? .route_name > b ? .trip ? .route_name) {
                    return 1;
                }
                return -1;
            }
            if (a ? .arrival_time > b ? .arrival_time) {
                return 1;
            }
            return -1;
        }
        if (a ? .trip ? .route_name > b ? .trip ? .route_name) {
            return 1;
        }
        return -1;
    });

    data ? .forEach((item) => {
        const index = arr ? .findIndex((val) => val ? .trip.route_id === item ? .routeId);

        for (let j = index; j > 0; j--) {
            let temp = {};
            temp = arr[j - 1];
            arr[j - 1] = arr[j];
            arr[j] = temp;
        }
    });
    return arr;
};

const getPlainObject = (data = []) => {
    let newPlainData = {};
    if (data ? .length) {
        data ? .forEach((el) => {
            newPlainData = { ...newPlainData,
                ...el
            };
        });
    }
    return newPlainData;
};

const getIsPassStartTimeReached = (passInfo, chaloTime) => (chaloTime || Date.now()) >=
    passInfo ? .startTime;

const getIsActivationTimeExpired = (ticketInfo = {}) => {
    const lastActivationTime = ticketInfo ? .rideCount ?
        .[ticketInfo ? .rideCount ? .length - 1] ? .punchingTime;
    const activeDuration = get(ticketInfo, ['activeDuration']) || process.env.REACT_APP_PASS_ACTIVATION_DURATION;
    if (!lastActivationTime) {
        return false;
    }
    if (moment().diff(moment(lastActivationTime), 'seconds') >= activeDuration / 1000) {
        return false;
    }
    return true;
};

const getIsTicketPending = (passes = []) => passes ? .some((ticketInfo) => ticketInfo ? .status === 'PENDING');

const getSortedTicketList = (
    passes = [],
) => passes ? .sort((passA, passB) => passB ? .bookingTime - passA ? .bookingTime);

const getBusFrequency = (timeTableInfo) => {
    const schedule = {};
    const {
        start_time,
        end_time,
        frequency
    } = get(timeTableInfo, 'frequency_tuple', timeTableInfo);
    set(schedule, 'scheduleFromTime', start_time, '');
    set(schedule, 'scheduleFrom', moment.utc(start_time * 1000).format('hh:mm A'), '');
    set(schedule, 'scheduleTo', moment.utc(end_time * 1000).format('hh:mm A'), '');
    set(schedule, 'scheduleToTime', end_time, '');
    schedule.frequency = frequency;
    schedule.isFrequency = !!frequency;
    return schedule;
};

const getBusStartEndFromFrequency = (startInfo, endInfo) => {
    const schedule = {};
    const start_time = get(startInfo, 'frequency_tuple.start_time') || startInfo.start_time;
    const end_time = get(endInfo, 'frequency_tuple.end_time') || startInfo.end_time || get(endInfo, 'frequency_tuple.start_time') || endInfo.start_time;
    set(schedule, 'scheduleFrom', moment.utc(start_time * 1000 || '0000').format('hh:mm A'), '');
    set(schedule, 'scheduleTo', moment.utc(end_time * 1000).format('hh:mm A'), '');
    return schedule;
};

const validateRides = (userPassData = {}, chaloTime = getTimestamp()) => {
    const count = getTodayRemainingTripBalance(userPassData ? .rideCount, chaloTime);
    if (userPassData ? .maxTripsPerDay === -1 && count === userPassData ? .numOfTrips &&
        getIsActivationWindowExpired(userPassData, chaloTime)) {
        return true;
    }
    if (userPassData ? .productSubType === 'rideBasedPass' &&
        count === userPassData ? .maxTripsPerDay && userPassData ? .maxTripsPerDay !== -1 &&
        getIsActivationWindowExpired(userPassData, chaloTime)) {
        return true;
    }
    return false;
};

const getTimeTableSchedule = (timeTable) => {
    if (!timeTable ? .length) {
        return {};
    }
    const startTime = timeTable ? .[0];
    const endTime = timeTable ? .[timeTable ? .length - 1];
    const schedule = getBusStartEndFromFrequency(startTime, endTime || startTime);
    let scheduleUpcomingTiming = timeTable ?
        .find(
            (timing) => moment()
            .startOf('day')
            .add(timing ? .start_time, 'seconds')
            .diff(moment(), 'minutes') >= 0,
        );
    scheduleUpcomingTiming = moment()
        .startOf('day')
        .add(scheduleUpcomingTiming ? .start_time, 'seconds')
        .format('hh:mm A');
    set(schedule, 'scheduleUpcoming', scheduleUpcomingTiming, '');
    // set(schedule, 'scheduleFrom', moment.utc(startTime?.start_time * 1000).format('hh:mm A'), '');
    // set(schedule, 'scheduleTo', moment.utc(endTime?.start_time * 1000).format('hh:mm A'), '');
    return schedule;
};

const getCurrentTimeTable = (timeTableInfo, chaloTime) => {
    let currentSchedule = {};
    for (let index = 0; index < timeTableInfo.length; index += 1) {
        const element = timeTableInfo[index];

        const {
            scheduleFrom,
            scheduleFromTime,
            scheduleTo,
            scheduleToTime,
            frequency,
            isFrequency,
        } = getBusFrequency(element);
        const seconds = (moment(chaloTime) - moment(chaloTime).startOf('day')) / 1000;

        if (scheduleToTime > seconds && scheduleFromTime <= seconds) {
            currentSchedule = {
                scheduleFrom,
                scheduleTo,
                isFrequency,
                frequency,
            };
            break;
        } else if (scheduleFromTime >= seconds) {
            currentSchedule = {
                scheduleFrom,
                scheduleTo,
            };
            break;
        }
    }
    return currentSchedule;
};

const removeDuplicateBusNoWithLatestTS = (busRouteInfo) => {
    let busData = '';
    const busObj = {};
    Object.keys(busRouteInfo) ? .map((routeInfoKey) => {
        if (typeof busRouteInfo[routeInfoKey] === 'string') {
            busData = JSON.parse(busRouteInfo[routeInfoKey]);
        }
        const duplicateBusNoDetails = find(busObj, {
            vNo: busData ? .vNo
        });
        if (duplicateBusNoDetails) {
            if (duplicateBusNoDetails.tS < busData ? .tS) {
                const oldRouteKey = duplicateBusNoDetails ? .key;
                busObj[oldRouteKey] = busData;
                busObj[oldRouteKey].key = duplicateBusNoDetails ? .key;
            }
        } else {
            busObj[routeInfoKey] = busData;
            busObj[routeInfoKey].key = routeInfoKey;
        }
        return true;
    });
    return busObj;
};

const getDurationInDays = (durationId) => {
    const duration = durationId ? moment.duration(durationId).asDays() : 0;
    if (!duration) {
        return '';
    }
    if (duration > 1) {
        return `${duration} Days`;
    }
    return `${duration} Day`;
};

const getProductName = (product, fare) => {
    // use in user detail page
    if (product ? .passType) return fare.displayName || product.name;
    return product ? .name;
};

const getPassStartDate = (passStartDate, chaloTime) => {
    if (moment(Number(passStartDate || getDate())).format('x') < chaloTime) {
        return chaloTime;
    }
    return new Date(passStartDate || getDate()).getTime();
};

const getBusPassProductData = () => ({
    lastName: '',
    passStartDate: '',
    gender: '',
    city: '',
    mobileNumber: '',
    deviceId: getDeviceId(),
    paymentType: 'online',
    routeNames: [],
    numOfDays: '',
    endStopId: '', // not required
    passType: '',
    specialFeatures: [],
    profilePhoto: '',
    lpVer: 'v1',
    startTime: '',
    id: '',
    configurationId: 'XbpOB7d7s',
    agency: '',
    appVer: process.env.REACT_APP_VERSION,
    startStopName: '',
    dateOfBirth: '',
    agencies: [{
        // passengerType: 'GENERAL',
        // agency: 'BCLL',
        // city: '',
        // proofs: {
        //   PHOTOGRAPH: '',
        // },
    }, ],
    passFare: '',
    userId: '',
    isSubMerchant: true,
    transactionType: 'MOBILE_PASS',
    firstName: '',
    passengerType: '',
    mailId: '',
    endStopName: '',
    startStopId: '',
    category: '',
    displayProps: '{}',
    routeIds: [],
    source: 1,
});

const getRequestBodyDataForPurchasingPass = (
    productInfo,
    profileData,
    userId,
    isVerificationRequired,
    isPass,
) => {
    let requestData = {};
    if (isPass) {
        requestData.appVer = process.env.REACT_APP_VERSION;
        requestData.city = productInfo ? .city;
        requestData.deviceId = getDeviceId();
        if (!isVerificationRequired) {
            requestData.paymentProps = {
                lpVer: 'v1',
                paymentType: 'online',
            };
        } else {
            requestData.proofs = productInfo ? .proofs;
        }
        requestData.userDetails = {
            mailId: productInfo ? .userProfile ? .mailId || '',
            mobileNumber: productInfo ? .userProfile ? .mobileNumber || '',
            userName: `${productInfo?.userProfile?.firstName}${productInfo?.userProfile?.lastName}`,
            gender: productInfo ? .userProfile ? .gender ? .toUpperCase(),
            dobInMillis: productInfo ? .userProfile ? .dobInMillis ||
                productInfo ? .userProfile ? .dateOfBirth,
            userId,
        };
        requestData.passProps = {
            passStartDate: getPassStartDate(productInfo.passStartDate || getDate(),
                productInfo.chaloTime),
            categoryId: productInfo ? .categoryId,
            fmId: productInfo ? .fmId,
            configurationId: productInfo ? .configurationId,
            passFare: productInfo ? .passFare || productInfo ? .fareInfo ? .payableAmount,
        };
        if (productInfo ? .isRenew) {
            requestData.passProps = {
                ...requestData.passProps,
                passId: productInfo ? .passId,
                isRenew: productInfo ? .isRenewable,
            };
        }
        requestData.source = 1;
        return requestData;
    }
    const {
        fullName,
        gender,
        startPassDate,
        dateOfBirth,
    } = productInfo ? .busPassUser || {};
    const {
        city,
        agency,
        id
    } = productInfo ? .product || {};
    const {
        fareInfo: {
            payableAmount: passFare
        },
        durationId,
        specialFeatures,
        fmId,
    } = productInfo ? .fair || {};
    const documents = productInfo ? .documents || {};
    const {
        id: categoryName
    } = productInfo ? .category || {};

    const {
        userProfile: {
            mailId,
            mobileNumber,
            profilePhoto,
        } = {},
    } = profileData || {};
    if (((productInfo ? .product ? .productType ? .toLowerCase() === 'magicpass' || productInfo ? .product ? .productType ? .toLowerCase() === 'pass') && productInfo ? .product ? .productSubType ? .toLowerCase() === 'magicpass')) {
        requestData = getBusPassProductData();
        requestData.mobileNumber = mobileNumber || '';
        requestData.profilePhoto = profilePhoto || '';
        requestData.mailId = mailId || '';
        if (documents && isObject(documents)) {
            Object.keys(documents).forEach((documentId) => {
                set(requestData, `agencies[0].proofs.${documentId}`, documents[documentId]);
            });
            set(requestData, 'agencies[0].city', city);
            set(requestData, 'agencies[0].passengerType', categoryName ? .toUpperCase());
            set(requestData, 'agencies[0].agency', agency);
        }
        requestData.id = id;
        requestData.profilePhoto = documents.PHOTOGRAPH;
        requestData.configurationId = id;
        requestData.agency = agency;
        requestData.firstName = fullName ? .split(' ') ? .[0];
        requestData.lastName = fullName ? .split(' ') ? .[1] || '';
        requestData.gender = gender ? .toUpperCase();
        requestData.passStartDate = getPassStartDate(startPassDate || getDate(),
            productInfo.chaloTime);
        requestData.dateOfBirth = moment(dateOfBirth).format('DD/MM/YYYY');
        requestData.passFare = Number(passFare);
        requestData.city = city;
        requestData.numOfDays = durationId / (1000 * 3600 * 24);
        requestData.category = categoryName ? .toUpperCase();
        requestData.passengerType = categoryName ? .toUpperCase();
        requestData.specialFeatures = specialFeatures;
        requestData.userId = userId;
        requestData.source = 1;
        return requestData;
    }
    if ((productInfo ? .product ? .productType ? .toLowerCase() === 'superpass' && (productInfo ? .product ? .productSubType ? .toLowerCase() === 'magicpass' || productInfo ? .product ? .productSubType ? .toLowerCase() === 'ridebasedpass'))) {
        if (documents && isObject(documents)) {
            Object.keys(documents).forEach((documentId) => {
                set(requestData, `proofs.${documentId}`, documents[documentId]);
            });
        }
        requestData.appVer = process.env.REACT_APP_VERSION;
        requestData.city = city;
        requestData.deviceId = getDeviceId();
        if (!isVerificationRequired) {
            requestData.paymentProps = {
                lpVer: 'v1',
                paymentType: 'online',
            };
        }
        requestData.source = 1;
        requestData.userDetails = {
            mailId: mailId || '',
            mobileNumber: mobileNumber || '',
            userName: fullName,
            gender: gender ? .toUpperCase(),
            dobInMillis: dateOfBirth,
            userId,
        };
        requestData.passProps = {
            passStartDate: getPassStartDate(startPassDate || getDate(), productInfo.chaloTime),
            categoryId: categoryName,
            fmId: Number(fmId),
            configurationId: id,
            passFare: Number(passFare),
        };
        return requestData;
    }
    return requestData;
};
// const getDecryptionKeyForQR = (userPassData) => {
//   if (userPassData) {
//     const userId = userPassData?.userProfile?.userId?.match(/.{1,2}/g);
//     const passId = userPassData?.passId?.match(/.{1,1}/g)
// || userPassData?.ticketId?.match(/.{1,1}/g);
//     const result = userId.reduce((arr, v, i) => {
//       if (i === (userId.length - 1) && passId[i + 1]) {
//         return arr.concat(arr, passId.slice(i, passId.length));
//       }
//       if (passId[i]) {
//         return arr.concat(v, passId[i]);
//       }
//       arr.push(v);
//       return arr;
//     }, []);
//     return window.btoa(result.join('')).slice(0, 16);
//   }
//   return '';
// };

const getPwaEncryptionKey = (userId, bookingId) => {
    const userIdLen = userId.length;
    const bookingIdLen = bookingId.length;
    let key = '';

    let i;
    let j;
    for (i = 0, j = 0; i < userIdLen && j < bookingIdLen; i += 2, j++) {
        key += userId.substring(i, i + 2);
        key += bookingId.substring(j, j + 1);
    }

    if (i < userIdLen) key += userId.substring(i, userIdLen);
    if (j < bookingIdLen) key += bookingId.substring(j, bookingIdLen);
    return window.btoa(key).slice(0, 16);
};
const getWholeName = (first, second) => `${first} ${second}`;

const getTicketCategoryInfoText = (passengerDetails) => {
    const detailsArray = [];
    if (passengerDetails) {
        if (Array.isArray(passengerDetails)) {
            passengerDetails ? .map(
                (element) => {
                    if (element ? .count) {
                        detailsArray.push(getWholeName(element ? .count, upperFirst(element ? .name)));
                    }
                    return '';
                },
            );
        } else {
            Object.keys(passengerDetails) ? .map(
                (element) => {
                    if (passengerDetails ? .[element] ? .c) {
                        detailsArray.push(getWholeName(passengerDetails ? .[element] ? .c, upperFirst(element)));
                    }
                    return '';
                },
            );
        }
    }
    return detailsArray.join(', ');
};

const isFareChangedForRoute = (newFareDetails, passFareDetails) => {
    let isFareChanged = false;
    Object.keys(passFareDetails ? .passengerDetails).map((element) => {
        if (Number(passFareDetails ? .passengerDetails ? .[element] ? .ff) !==
            Number(newFareDetails ? .fares ? .passengerDetails ? .[element] ? .ff)) {
            isFareChanged = true;
            return true;
        }
        return false;
    });
    return isFareChanged;
};

const checkRouteUsingRemoteConfig = (city) => {
    const enabledCities = process.env.REACT_APP_SOUND_VALIDATION_DISABLED || [];
    if (enabledCities ? .includes(city ? .toLowerCase())) {
        return false;
    }
    return true;
};

const checkTrialOffer = (productId) => {
    const enabledCities = process.env.REACT_APP_TRIAL_OFFERS || [];
    if (enabledCities ? .includes(productId)) {
        return true;
    }
    return false;
};

const checkFindMyBus = (city) => {
    const findMyBusCities = process.env.REACT_APP_STOP_BASED_TRIP_PLANNER_CITIES || [];
    if (findMyBusCities ? .includes(city)) {
        return true;
    }
    return false;
};

const checkRouteNameDisableCity = (city) => {
    const routeNameDisableCities = process.env.REACT_APP_CITY_LIST_ROUTE_DISABLED;
    if (routeNameDisableCities ? .includes(city)) {
        return true;
    }
    return false;
};

const productAvailabilityFilter = (product, subCategory, category, fare) => {
    if (!product ? .isActive) {
        return {
            product: true
        };
    }
    if (subCategory && !subCategory ? .isActive) {
        return {
            subCategory: true,
        };
    }
    if (!category ? .isActive) {
        return {
            category: true
        };
    }
    if (!fare ? .isActive) {
        return {
            fare: true
        };
    }
    return false;
};

const nearestBusStopsArray = (nearestBusStopsData) => {
    const arr = [];
    nearestBusStopsData ? .payload ? .[0] ? .summary ? .forEach((stops) => {
        const busDataObject = {
            distance: nearestBusStopsData ? .payload[0] ? .distance,
            agency_name: stops ? .trip ? .agency_name,
            stop_name: nearestBusStopsData.payload[0].stop ? .stop_name,
            stop_id: stops.trip ? .direction_stop ? .stop_id,
            route_id: stops.trip ? .route_id,
            last_stop_name: stops ? .trip.direction_stop ? .stop_name,
            station_type: stops ? .trip ? .direction_stop ? .station_type,
            transport_type: stops ? .trip ? .direction_stop ? .transport_type,
            route_name: stops ? .trip ? .route_name,
            arrival_time: stops ? .arrival_time,
            trip: stops ? .trip,
        };
        arr.push(busDataObject);
    });
    return getStopFilterRoutes(arr);
};
const getSeatDisplay = (status) => {
    let imageToUse = null;
    switch (status) {
        case -1:
            return null;
        case 0:
        case 3:
            imageToUse = SeatsAvailable;
            break;
        case 1:
        case 4:
            imageToUse = StandingAvailable;
            break;
        case 2:
        case 5:
            imageToUse = Overcrowded;
            break;
        default:
            return null;
    }
    return imageToUse ? ( <
        >
        <
        img className = "seats-image"
        src = {
            imageToUse
        }
        alt = "" / > {
            /* <IconButton className="seat-info-icon">
                    <InfoOutlinedIcon />
                  </IconButton> */
        } <
        />
    ) : null;
};

const getFare = (fare) => {
    let min = 0;
    fare ? .forEach((item) => {
        min += item ? .default_fare;
    });
    return min;
};
const toRad = (Value) => Value * Math.PI / 180;

const getDistance = (user, stop) => {
    const R = 6371; // km
    const dLat = toRad(user ? .lat - stop ? .stop_lat);
    const dLon = toRad(user ? .lng - stop ? .stop_lon);
    const lat1 = toRad(user ? .lat);
    const lat2 = toRad(stop ? .stop_lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
};

const getPolylines = (decodePolylineData) => {
    if (!decodePolylineData) {
        return [];
    }
    const polylineArray = [];
    decodePolylineData.map((element) => polylineArray.push({
        polylineProps: element ? .polylineProps || {
            strokeColor: '#000000',
            strokeWeight: 4
        },
        path: element ? .path || element
    }));
    return polylineArray;
};
const isNonWalkAndNonAutoMode = (legMode) => legMode !== 'AUTO' && legMode !== 'WALK';

const calculateDistance = (distance) => {
    const avgSpeed = 4000 / 3600;
    const time = (distance * 1000) / avgSpeed;
    if (time < 60) {
        return '1 min';
    }
    if (time < 60 * 15) {
        const timeInMin = Math.round(time / 60);
        return `${timeInMin} min`;
    }

    return `${distance.toFixed(1)} km`;
};
const isProofRequired = (products) => {
    const {
        fair = {}, product = {}, category = {}
    } = products || {};
    if (category ? .verification === false || fair ? .verification === false) {
        if (product ? .isProofRequired === false) {
            return false;
        }
        if (category ? .isProofRequired === false) {
            return false;
        }
        if (fair ? .isProofRequired === false) {
            return false;
        }
    }
    return true;
};

const getReclaimTime = (city) => {
    const cityWiseRBSPReclaimTime = process.env.REACT_APP_CITY_WISE_RBSP_RECLAIMTIME ?
        JSON.parse(process.env.REACT_APP_CITY_WISE_RBSP_RECLAIMTIME) :
        {
            all: 86400000,
            mumbai: 300000
        };
    const reclaimTime = cityWiseRBSPReclaimTime[city] || cityWiseRBSPReclaimTime ? .all;
    return reclaimTime;
};

const formatCardNumber = (value) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
    const onlyNumbers = value.replace(/[^\d]/g, '');

    return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) => [$1, [`${$2[0]}XXX`],
        ['XXXX'], $4
    ].filter((group) => !!group).join(' '));
};

const addCommaInNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const findNextWeekDaysName = () => {
    const Days = ['Today', 'Tomorrow'];
    for (let i = 2; i < 8; i++) {
        Days.push(getMoment().weekday(getMoment().isoWeekday() + i).format('dddd'));
    }
    return Days;
};

const getVehicalNumber = (number = '') => {
    if (number) {
        return ( <
            >
            <
            span className = "vehicalNumber" > {
                number ? .substring(0, number.length - 4)
            } < /span> {
                number ? .substr(-4)
            } <
            />
        );
    }
    return <span className = "lable-value" > Bus not assigned yet < /span>;
};

function navigateToGoogleMaps(latitude, longitude) {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank'); // Opens the URL in a new tab/window
}

const handleTimingLogo = (scheduledStopTime, estimatedStopTime, city) => {
    if (scheduledStopTime && estimatedStopTime) {
        const premiumBusesCitiesNative = JSON.parse(process.env.REACT_APP_PREMIUM_BUS_NATIVE) ?
            .cityWiseConfig ? .filter(
                (cityData) => cityData ? .city ? .toLowerCase() === city ? .toLowerCase(),
            ) ? .[0];

        if ((estimatedStopTime / 1000) - (scheduledStopTime / 1000) <
            premiumBusesCitiesNative ? .pollingConstants ? .onTimeBufferThresholdInSec) {
            return 'On Time';
        }
        if ((estimatedStopTime / 1000) - (scheduledStopTime / 1000) >
            premiumBusesCitiesNative ? .pollingConstants ? .runningLateStatusThresholdInSec) {
            return 'Delayed';
        }
    }
    return 'On Time';
};

const isLatestBookingInActiveState = (oldPass, passes, chaloTime) => {
    const latestPass = passes ? .filter(
        (pass) => pass ? .firstBookingId === oldPass ? .firstBookingId,
    ) ? .sort((a, b) => b ? .bookingTime - a ? .bookingTime) ? .[0];
    if ((latestPass ? .status === bookingStatus.ACTIVE) &&
        !(
            (Number(oldPass ? .tripSlotStartTime) - 300000 <= Number(latestPass ? .tripSlotStartTime)) &&
            (Number(latestPass ? .tripSlotStartTime) <= (Number(oldPass ? .tripSlotStartTime) + 300000))
        ) &&
        !(latestPass ? .status === bookingStatus.EXPIRED || chaloTime > latestPass.expiryTime)) {
        return true;
    }
    return false;
};

const getLatestBookingInActiveState = (oldPass, passes, chaloTime) => {
    const latestPass = passes ? .filter(
        (pass) => pass ? .firstBookingId === oldPass ? .firstBookingId,
    ) ? .sort((a, b) => b ? .bookingTime - a ? .bookingTime) ? .[0];
    if ((latestPass ? .status === bookingStatus.ACTIVE) &&
        !(latestPass ? .status === bookingStatus.EXPIRED || chaloTime > latestPass.expiryTime)) {
        return latestPass;
    }
    return false;
};

const getPremiumProducts = (products) => (Array.isArray(products) ? products.filter(
    (element) => element ? .serviceType ? .includes(PassUsageOptions ? .PREMIUM) &&
    element ? .isActive && element ? .isVisible && element ? .name !== airportTravelPlan,
) : []);

const getPremiumProductsWithConfigId = (
    products, productLandingConfigId,
) => (Array.isArray(products) ? products.filter(
    (element) => element ? .serviceType ? .includes(PassUsageOptions ? .PREMIUM) &&
    element ? .isActive && productLandingConfigId === element ? .id,
) : []);

function findClosestPoint(targetLat, targetLon, pointsArray) {
    let closestPoint = null;
    let closestDistance = Infinity;
    for (let index = 0; index < pointsArray.length; index++) {
        const distance = getDistance({
            lat: targetLat,
            lng: targetLon
        }, {
            stop_lat: pointsArray[index] ? .latitude,
            stop_lon: pointsArray[index] ? .longitude,
        });
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPoint = index;
        }
    }
    return closestPoint;
}

export {
    typeExtractor,
    retry,
    getTimeString,
    isInputExistInMap,
    contentTypeCalculator,
    getName,
    formatPhoneNumber,
    getString,
    getInitials,
    encodeUserSettings,
    decodeUserSettings,
    extractNumber,
    isAuthorized,
    JArray,
    getDurationInDays,
    urltoFile,
    getRandomNumber,
    crudSelector,
    closeAppDrawer,
    openAppDrawer,
    showSnackbar,
    getDeviceId,
    setDeviceId,
    validateFileSize,
    syncPassesWithLocalDb,
    getIsExpired,
    getExpiryTime,
    authAPI,
    getPlainObject,
    getIsPassStartTimeReached,
    getIsActivationTimeExpired,
    parse,
    getHoursAndMinutesFromSeconds,
    getIsTicketPending,
    getSortedTicketList,
    getTimeTableSchedule,
    getIsActivationWindowExpired,
    removeDuplicateBusNoWithLatestTS,
    getBusFrequency,
    isPassOrTicketAvailable,
    getProductName,
    getRequestBodyDataForPurchasingPass,
    getTicketStatus,
    getPassStartTime,
    // getDecryptionKeyForQR,
    validateRides,
    getKeyForEncryptAndDecrypt,
    getTimeElapsedSince2022,
    getTodayRemainingTripBalance,
    getTicketCategoryInfoText,
    isFareChangedForRoute,
    syncRideHistoryWithLocalDb,
    checkRouteUsingRemoteConfig,
    productAvailabilityFilter,
    getCurrentTimeTable,
    checkTrialOffer,
    getPlaceString,
    getStopPlaceList,
    nearestBusStopsArray,
    getTimeForBusArrival,
    getStopFilterRoutes,
    getFare,
    isNonWalkAndNonAutoMode,
    checkFindMyBus,
    getPolylines,
    getSeatDisplay,
    isETAAvailiable,
    getEtaParsedData,
    getSortdBusses,
    getIsStopInsideCity,
    calculateDistance,
    getDistance,
    getTimeZoneDiffInMillis,
    getMoment,
    getTimestamp,
    getDate,
    checkRouteNameDisableCity,
    isProofRequired,
    getReclaimTime,
    formatCardNumber,
    addCommaInNumber,
    findNextWeekDaysName,
    getVehicalNumber,
    getPwaEncryptionKey,
    navigateToGoogleMaps,
    isLatestBookingInActiveState,
    getLatestBookingInActiveState,
    handleTimingLogo,
    findClosestPoint,
    getPremiumProducts,
    getPremiumProductsWithConfigId,
};