export const WEATHERCODES = Object.freeze({
    CLEAR_SKY: 0,
    MAINLY_CLEAR: 1,
    PARTLY_CLOUDY: 2,
    OVERCAST: 3,
    FOG: 45,
    DEPOSITING_RIME_FOG: 48,
    DRIZZLE_LIGHT: 51,
    DRIZZLE_MODERATE: 53,
    DRIZZLE_DENSE: 55,
    FREEZING_DRIZZLE_LIGHT: 56,
    FREEZING_DRIZZLE_DENSE: 57,
    RAIN_SLIGHT: 61,
    RAIN_MODERATE: 63,
    RAIN_HEAVY: 65,
    FREEZING_RAIN_LIGHT: 66,
    FREEZING_RAIN_HEAVY: 67,
    SNOW_FALL_SLIGHT: 71,
    SNOW_FALL_MODERATE: 73,
    SNOW_FALL_HEAVY: 75,
    SNOW_GRAINS: 77,
    RAIN_SHOWERS_SLIGHT: 80,
    RAIN_SHOWERS_MODERATE: 81,
    RAIN_SHOWERS_VIOLENT: 82,
    SNOW_SHOWERS_SLIGHT: 85,
    SNOW_SHOWERS_HEAVY: 86,
    THUNDERSTORM: 95,
    THUNDERSTORM_LIGHT_HAIL: 96,
    THUNDERSTORM_HEAVY_HAIL: 99,
});

/**
 *
 * @param UTCHourOffset number repsenting the UTC offset in hours e.g. JST is 9, EST is -4
 * @returns the time formatted as a string in ISO format
 * @example +9:00 for JST time
 *
 */
export function ISOFormatTimeZoneOffset(UTCHourOffset: number): string {
    let integerSign: string = UTCHourOffset < 0 ? "-" : "+";
    let formattedHour: string =
        UTCHourOffset < 10
            ? `${integerSign}0${Math.abs(UTCHourOffset)}:00`
            : `${integerSign}${Math.abs(UTCHourOffset)}:00`;
    return formattedHour;
}

export function getCurrentDateInTimeZone(timeZone: string): string {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return formatter.format(new Date());
}
