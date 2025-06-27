import {
    cancel,
    fork,
    take,
} from 'redux-saga/effects';

const customTakeLatest = (pattern, saga, ...args) => fork(function* customTakeLatestFunc() {
    const lastTask = {};
    while (true) {
        const action = yield take(pattern);
        const id = action.listId || action.id || action.url;
        if (lastTask[id]) {
            yield cancel(lastTask[id]); // cancel is no-op if the task has already terminated
        }
        lastTask[id] = yield fork(saga, ...args.concat(action));
    }
});

export default customTakeLatest;