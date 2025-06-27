import mixpanel from 'mixpanel-browser';
import {
    initializeApp
} from 'firebase/app';
import {
    getAnalytics,
    logEvent,
    setUserProperties
} from 'firebase/analytics';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const actions = {
    identifyUser: (id, userName) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.identify(id);
                mixpanel.people.set({
                    $name: userName
                });
            }
            if (process.env.REACT_APP_PLOTLINE_PROJECT_TAKEN) {
                window.plotline('identify', {
                    id,
                    userName,
                });
            }
        } catch (e) {
            //
        }
    },
    identify: (id) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.identify(id);
            }
            if (process.env.REACT_APP_PLOTLINE_PROJECT_TAKEN) {
                window.plotline('identify', {
                    id,
                });
            }
        } catch (e) {
            //
        }
    },
    alias: (newId, id) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) mixpanel.alias(newId, id);
        } catch (e) {
            //
        }
    },
    track: (event, props, flag) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.track(event, {
                    ...props,
                }, {
                    send_immediately: true
                });
                if (!flag) {
                    window.plotline('track', event, { ...props
                    });
                }
                logEvent(analytics, event, { ...props
                });
            }
        } catch (e) {
            //
        }
    },
    setSuperProperties: (props) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.register({
                    ...props,
                });
            }
            if (process.env.REACT_APP_FIREBASE_CONFIG) {
                setUserProperties(analytics, { ...props
                });
            }
        } catch (e) {
            //
        }
    },
    removeSuperProperties: (props) => {
        // here props type is string
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.unregister(props);
            }
        } catch (e) {
            //
        }
    },
    set: (id, props) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.identify(id);
                mixpanel.people.set(props);
            }
            if (process.env.REACT_APP_PLOTLINE_PROJECT_TAKEN) {
                window.plotline('identify', {
                    id,
                });
            }
        } catch (e) {
            //
        }
    },
    removeUserProperties: (props) => {
        // here props are single string for remove one property
        //  or array of string for remove multiple properites
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.people.unset(props);
            }
        } catch (e) {
            //
        }
    },
    reset: () => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.reset();
            }
        } catch (e) {
            //
        }
    },
    incrementSingleUserProperty: (key, value) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.people.increment(key, value);
            }
        } catch (e) {
            //
        }
    },
    incrementMultipleUserProperties: (props) => {
        // here type of props is object
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) {
                mixpanel.people.increment(props);
            }
        } catch (e) {
            //
        }
    },
    setOnce: (id, props) => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) mixpanel.set_once(id, props);
        } catch (e) {
            //
        }
    },
    getDistinctId: () => {
        try {
            if (process.env.REACT_APP_ADD_DATA_IN_MIXPANEL) return mixpanel.get_distinct_id();
        } catch (e) {
            //
        }
        return '';
    },
};

export default actions;