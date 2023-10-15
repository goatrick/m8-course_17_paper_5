function utcTimeToCron(utcTime, localTimezone = '+00:00') {
    try {
        // Convert the UTC time to a local time by adding the timezone offset.
        const utcDate = new Date(utcTime);
        const localOffset = parseInt(localTimezone.substr(1, 2)) * 60 + parseInt(localTimezone.substr(4, 2));
        const localDate = new Date(utcDate.getTime() + (localOffset * 60 * 1000));

        // Extract individual components of the local time.
        const minute = localDate.getUTCMinutes();
        const hour = localDate.getUTCHours();
        const day = localDate.getUTCDate();
        const month = localDate.getUTCMonth() + 1; // Months are zero-based
        const year = localDate.getUTCFullYear();

        // Create the cron schedule format.
        const cronSchedule = `${minute} ${hour} ${day} ${month} *`;

        return cronSchedule;
    } catch (error) {
        return error.message;
    }
}

// Example usage:
const utcTime = "2023-10-16T15:30:00Z";
const localTimezone = "+05:00"; // Replace with your server's local timezone offset
const cronSchedule = utcTimeToCron(utcTime, localTimezone);
console.log(`Cron schedule: ${cronSchedule}`);
