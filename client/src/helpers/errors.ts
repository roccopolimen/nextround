/**
 * @description Checks if a string is non-empty
 * @param {string} str the string to check
 * @returns {boolean} returns true if the string is not just whitespace
 * and false otherwise
 */
function checkNonEmptyString(str: string): boolean {
    return (str.trim() !== '');
}

/**
 * @description Checks if an array of strings are all non-empty
 * @param {Array<string>} strs the array of strings to check
 * @returns {boolean} true if no string in the array is just whitespace
 * and false otherwise
 */
function checkArrayOfStrings(strs: Array<string>): boolean {
    for(let str of strs) {
        if(!checkNonEmptyString(str)) {
            return false;
        }
    }
    return true;
}

/**
 * @description Checks if a given number is positive
 * @param {number} num the number to check
 * @returns {boolean} true if the number is greater than 0 and false otherwise
 */
function checkNonNegativeNumber(num: number): boolean {
    return (num > 0); 
}

/**
 * @description Checks if a given number is negative
 * @param {number} num the number to check
 * @returns {boolean} true if the number is less than 0 and false otherwise
 */
function checkNegativeNumber(num: number): boolean {
    return (num < 0); 
}

/**
 * @description Tests a given string to see if it is a valid email
 * @param {string} email the string to validate
 * @returns {boolean} true if the string is valid and false otherwise
 */
function checkEmail(email: string): boolean {
    return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.toLowerCase()));
}

/**
 * @description Checks if a given string is a valid name 
 * (doesen't contain any illegal characters)
 * @param {string} name the string to validate
 * @returns {boolean} true if the string contains no illegal characters 
 * and false otherwise
 */
function checkName(name: string): boolean {
    if(name.trim() !== '') {
        return((name.length >= 1) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\d]{1,20}$/.test(name));
    }
    return false;
}

/**
 * @description Checks if a given string is a valid date format
 * @param {string} dateStr the string to validate
 * @returns {boolean} true if the string is a valid date and false otherwise
 */
function checkDate(dateStr: string): boolean {
    return !isNaN(Date.parse(dateStr));
}

/**
 * @description Checks if a given string is a valid time
 * @param {string} timeStr the string to validate
 * @returns {boolean} true if the string is a valid time and false otherwise
 */
function checkTime(timeStr: string): boolean {
    return (/^([01]\d|2[0-3]):?([0-5]\d)$/.test(timeStr));
}


export {
    checkNonEmptyString,
    checkArrayOfStrings,
    checkNonNegativeNumber,
    checkNegativeNumber,
    checkEmail,
    checkName,
    checkDate,
    checkTime
}