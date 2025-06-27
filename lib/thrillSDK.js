function updateLogs(msg) {
    console.log('🚀 ~ file: index.js ~ line 27 ~ updateLogs ~ message', msg);
}

class SSDK {
    constructor(trillSDK) {
        this.trillSDK = trillSDK;
    }

    get() {
        return this.trillSDK;
    }

    set(data) {
        this.trillSDK = data;
    }

    setReadyToUse() {
        this.isReady = true;
    }
}

let trillSDK;
const ssdkInstance = new SSDK();
const initTrillSDK = () => {
    // eslint-disable-next-line no-undef
    trillSDK.initialise(TrillSDKConf.CONF_ONEWAY, {
        onError(errorCode, errorMessage) {
            updateLogs(`SDK Error: ${errorCode} | ${errorMessage}`, true);
        },
        onSDKReady() {
            updateLogs('SDK Ready to use....\n', false);
        },
        onPlayingCompleted() {
            updateLogs('Played .... ', true);
        },
        onStartedReceiving() {},
        onDecoded(payload) {
            updateLogs(`Received : ${payload.string}`, true);
        },
        onErrorDecoding() {
            updateLogs('Error Decoding Trill Tone', true);
        },
        onSendingCompleted() {
            updateLogs('Sending Completed', true);
        },
        // eslint-disable-next-line no-unused-vars
        onInfo(infoMessage, infoText) {
            // console.log("Finished Playing", true);
        },
    });
    return trillSDK;
};

// loadTrillScripts().then(() => {
setTimeout(() => {
    // eslint-disable-next-line no-undef
    trillSDK = new TrillSDK(false);
    ssdkInstance.set(trillSDK);
    initTrillSDK();
}, 1000);
// });

export default ssdkInstance;