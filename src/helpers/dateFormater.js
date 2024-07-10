// get month by number
const getMonth = (value, action = 'short') => {
    // action = {full: January, short: Jan }

    let month = '';
    switch (value) {
        case 0:
            month = action ? "January" : 'Jan';
            break;

        case 1:
            month = action ? "February" : 'Feb';
            break;

        case 2:
            month = action ? "March" : 'Mar';
            break;


        case 3:
            month = action ? "Aprile" : 'Apr';
            break;

        case 4:
            month = 'May';
            break;

        case 5:
            month = action ? "June" : 'Jun';

        case 6:
            month = action ? "July" : 'Jul';

        case 7:
            month = action ? "August" : 'Aug';

        case 8:
            month = action ? "September" : 'Sep';

        case 9:
            month = action ? "October" : 'Oct';

        case 10:
            month = action ? "November" : 'Nov';

        case 11:
            month = action ? "December" : 'Dec';
            break;

        default:
            break;
    }

    return month;
}


// ISO date format converter from "day month Year"
const isoStringDateFormat = (data) => {
    const date = new Date(data)
    return date.toISOString();
}
module.exports = {
    getMonth,
    isoStringDateFormat,
}