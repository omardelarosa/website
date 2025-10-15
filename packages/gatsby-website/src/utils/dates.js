import moment from 'moment';

export function formatTimestamp(timestamp) {
    const t = moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a');
    return t;
}
