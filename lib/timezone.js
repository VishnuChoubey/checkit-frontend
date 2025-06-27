class TimeZone {
    constructor() {
        this.TimeZone = 'Asia/Kolkata';
    }

    setTimeZone(timeZone) {
        if (timeZone) {
            this.timeZone = timeZone;
        }
    }

    getTimeZone() {
        return this.timeZone;
    }
}
const timeZoneInstance = new TimeZone();

export default timeZoneInstance;