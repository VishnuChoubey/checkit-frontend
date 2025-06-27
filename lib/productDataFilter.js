/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
import React from 'react';
import find from 'lodash/find';
import i18next from 'i18next';

import {
    passIcon,
    ticketIcon,
    ScanAndPayProductIcon,
    busCardRecharge,
} from '../Images';
import {
    PassUsageOptions
} from './constants';

export const ProductConfigDataParser = (productDataConfig, currencySymbol = '₹') => {
    const parsedProducts = {
        ...productDataConfig,
        products: [],
    };
    for (let i = 0; i < productDataConfig ? .products ? .length; i += 1) {
        const product = productDataConfig ? .products ? .[i] || {};
        if (((product.productType ? .toLowerCase() === 'magicpass' || product.productType ? .toLowerCase() === 'pass') && product.productSubType ? .toLowerCase() === 'magicpass')) {
            Object.values(product ? .fareMapping).forEach((element) => {
                element.forEach((fare) => {
                    const fareBreakup = [{
                        name: 'Pass price',
                        value: currencySymbol + fare ? .fare,
                    }];
                    if (fare.discountedFare && (fare.discountedFare !== fare ? .fare)) {
                        fareBreakup.push({
                            name: 'Discount',
                            value: currencySymbol + (fare ? .fare - fare ? .discountedFare),
                        }, );
                    }
                    fare.fareInfo = {
                        actualFare: fare ? .fare,
                        discountedFare: fare ? .discountedFare,
                        payableAmount: fare ? .discountedFare,
                        fareBreakup,
                    };
                });
            });
            const newProduct = {
                ...product,
                name: product.displayName || product.name,
                passType: 'magic',
            };
            parsedProducts.products.push(newProduct);
        } else {
            parsedProducts.products.push(product);
        }
    }
    return parsedProducts;
};

const ProductConfigDataFilter = (productDataConfig, city) => city && productDataConfig ? .products
    .filter(
        (item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        (item ? .productType ? .toLowerCase() !== 'singlejourneyticket') &&
        (((item ? .productType ? .toLowerCase() === 'magicpass' || item ? .productType ? .toLowerCase() === 'pass') && item ? .productSubType ? .toLowerCase() === 'magicpass') ||
            (item ? .productType ? .toLowerCase() === 'superpass' && (item ? .productSubType ? .toLowerCase() === 'magicpass' || item ? .productSubType ? .toLowerCase() === 'ridebasedpass'))) &&
        !(item ? .isVisible === false),
    );
// eslint-disable-next-line max-len
export const ProductConfigDataFilterForAll = (productDataConfig, city) => city && productDataConfig ? .products
    .filter(
        (item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        (((item ? .productType ? .toLowerCase() === 'magicpass' || item ? .productType ? .toLowerCase() === 'pass') && item ? .productSubType ? .toLowerCase() === 'magicpass') ||
            (item ? .productType ? .toLowerCase() === 'superpass' && (item ? .productSubType ? .toLowerCase() === 'magicpass' || item ? .productSubType ? .toLowerCase() === 'ridebasedpass')) ||
            (item ? .productType ? .toLowerCase() === 'singlejourneyticket')) &&
        !(item ? .isVisible === false),
    );
export const ProductConfigDataFilterForTicket = (
        productDataConfig, city,
    ) => city && productDataConfig ? .products ?
    .filter(
        (item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        (item ? .productType ? .toLowerCase() === 'singlejourneyticket') &&
        !(item ? .isVisible === false),
    );

export const ProductConfigDataFilterForPremiumBuses = (
        productDataConfig, city,
    ) => city && productDataConfig ? .products ?
    .filter(
        (item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        item ? .serviceType ? .includes(PassUsageOptions.PREMIUM) &&
        !(item ? .isVisible === false) &&
        !(item ? .isActive === false),
    );

export const ProductConfigDataFilterForPremiumBusesTicket = (
        productDataConfig, city,
    ) => city && productDataConfig ? .products ?
    .filter(
        (item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        (item ? .productSubType ? .toLowerCase() === 'premiumreserveticket') &&
        !(item ? .isVisible === false) &&
        !(item ? .isActive === false),
    );

export const ProductConfigDataFilterForCardRecharge = (
        productDataConfig, city,
    ) => city && productDataConfig ? .products ?
    .filter((item) => item ? .city ? .toLowerCase() === city ? .toLowerCase() &&
        (item ? .productType ? .toLowerCase() === 'cardrecharge'));

export const getProductHooks = (cityMetaData, city) => {
    let isOneWayTicketActive = false;
    let isMagicPassActive = false;
    let isScanPayAvailable = false;
    let isOnlineCardRechargeAvailable = false;
    const productHooks = {};
    const {
        data = []
    } = cityMetaData || [];
    let agencies = [];
    const modMaps = find(data, {
        city: city ? .toUpperCase()
    }) ? .modes_map || [];
    if (modMaps ? .length) {
        modMaps ? .forEach((cityAgencie) => {
            if (cityAgencie ? .mode === 'BUS') {
                agencies = cityAgencie ? .agencies || [];
            }
        });
    }

    agencies ? .forEach(
        (itemObj) => {
            const item = { ...itemObj
            };
            if (item ? .isScanPayAvailable && !isScanPayAvailable) {
                const modifiedItem = { ...item
                };
                isScanPayAvailable = true;
                modifiedItem.title = i18next.t('home.scannedAndPay');
                modifiedItem.productType = 'scanAndPay';
                modifiedItem.icon = ( <
                    img src = {
                        ScanAndPayProductIcon
                    }
                    alt = "Scan and pay icon"
                    className = "icon-style" /
                    >
                );
                productHooks.scanPayAvailable = modifiedItem;
            }
            if (item ? .isProductAvailable && !isOneWayTicketActive) {
                const modifiedItem = { ...item
                };
                isOneWayTicketActive = true;
                modifiedItem.title = i18next.t('home.oneWayTicket');
                modifiedItem.productType = 'singleJourneyTicket';
                modifiedItem.icon = ( <
                    img src = {
                        ticketIcon
                    }
                    alt = "Bus Ticket Icon"
                    className = "icon-style" /
                    >
                );
                productHooks.singleJourneyTicket = modifiedItem;
            }
            if (item ? .isProductAvailable && !isMagicPassActive) {
                const modifiedItem = { ...item
                };
                isMagicPassActive = true;
                modifiedItem.title = i18next.t('home.busPass');
                modifiedItem.productType = 'pass';
                modifiedItem.icon = ( <
                    img src = {
                        passIcon
                    }
                    alt = "Bus Pass Icon"
                    className = "icon-style" /
                    >
                );
                productHooks.pass = modifiedItem;
            }
            if (item ? .isOnlineCardRechargeAvailable && !isOnlineCardRechargeAvailable) {
                const modifiedItem = { ...item
                };
                isOnlineCardRechargeAvailable = true;
                modifiedItem.title = i18next.t('home.isOnlineCardRechargeAvailable');
                modifiedItem.productType = 'onlineCardRechargeAvailable';
                modifiedItem.icon = ( <
                    img src = {
                        busCardRecharge
                    }
                    alt = "Card Recharge"
                    className = "icon-style" /
                    >
                );
                productHooks.onlineCardRechargeAvailable = modifiedItem;
            }
        },
    );
    return productHooks;
};

export const isYourTicketAndPassAvailable = (cityMetaData, city) => {
    const {
        data = []
    } = cityMetaData || [];
    let agencies = [];
    const modMaps = find(data, {
        city: city ? .toUpperCase()
    }) ? .modes_map || [];
    if (modMaps ? .length) {
        modMaps ? .forEach((cityAgencie) => {
            if (cityAgencie ? .mode === 'BUS') {
                agencies = cityAgencie ? .agencies || [];
            }
        });
    }
    let isProductAvailable = false;
    agencies.some((item) => {
        if (item ? .isProductAvailable) {
            isProductAvailable = true;
            return isProductAvailable;
        }
        return isProductAvailable;
    });
    return isProductAvailable;
};

export default ProductConfigDataFilter;