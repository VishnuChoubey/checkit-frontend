/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import aesEcb from 'aes-ecb';
import ssdkInstance from './thrillSDK';
import {
    getPwaEncryptionKey,
    getTimeElapsedSince2022
} from './util';

const toBytesInt24 = (minutes, sec) => {
    let ascii = '';
    for (let i = 0; i < 2; i++) {
        ascii += String.fromCharCode((minutes >> (8 * i)) & 255);
    }
    ascii += String.fromCharCode(((((minutes >> (8 * 2)) & 31) << 3) | sec) & 255);
    return ascii;
};

const qrSoundPlay = (userPassData) => {
    const timeElapsedSince2020 = getTimeElapsedSince2022();

    const valueTime = toBytesInt24(timeElapsedSince2020.minutes, timeElapsedSince2020.sec);
    if (userPassData ? .tone) {
        const key = getPwaEncryptionKey(userPassData ? .userProfile ? .userId, userPassData ? .transactionId);

        const decryptedString = aesEcb.decrypt(key, userPassData ? .tone);
        const decodedString = window.atob(decryptedString);

        ssdkInstance ? .trillSDK ? .start_sender(
            decodedString
            // eslint-disable-next-line no-undef
            +
            valueTime, TrillSDKConf.ALGO_STREAM_3, Infinity, 1,
        );
    }
};
export default qrSoundPlay;