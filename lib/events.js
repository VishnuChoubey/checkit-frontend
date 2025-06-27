/*      Super Simple Events & Hooks
 *  Author: Dash Automation, LLC.
 *  Braden R. Napier
 *  http://www.dashos.net
 *
 *  This was meant to be an extremely lightweight platform for registering
 *  callbacks and triggering those callbacks.  It was not meant to provide
 *  the many features of other options, but really meant as an extremely
 *  low footprint option for triggering a callback based on an event in
 *  your system.  It can also be used for simple communication between
 *  your components, although this should generally be done following the
 *  react design guidelines.
 */
const Callbacks = {};
const Events = {
    on: (at, id, callback) => {
        Events.listen(at, id, callback);
    },
    listen: (at, id, callback) => {
        if (at === '') {
            return false;
        }
        if (at in Callbacks) {
            Callbacks[at][id] = callback;
        } else {
            Callbacks[at] = {};
            Callbacks[at][id] = callback;
        }
        return id;
    },
    t: (at, data) => Events.trigger(at, data),
    trigger: (at, data) => {
        const copyData = data || '';
        const obj = Callbacks[at];
        Object.keys(obj || {}).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) obj[key](copyData);
        });
    },
    rm: (at, id) => Events.remove(at, id),
    remove: (at, id) => {
        if (Callbacks[at] && Callbacks[at][id]) delete Callbacks[at][id];
    },
    removeAll: (at) => {
        delete Callbacks[at];
    },
};

module.exports = Events;