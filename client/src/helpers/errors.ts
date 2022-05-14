
/**
 * @description Checks if a string is non-empty
 * @param {string} str the string to check
 * @returns {boolean} returns true if the string is not just whitespace
 * and false otherwise
 */
export const checkNonEmptyString = (str: string): boolean => {
    return (str.trim() !== '');
};

/**
 * @description Checks if an array of strings are all non-empty
 * @param {Array<string>} strs the array of strings to check
 * @returns {boolean} true if no string in the array is just whitespace
 * and false otherwise
 */
export const checkArrayOfStrings = (strs: Array<string>): boolean => {
    for(let str of strs)
        if(!checkNonEmptyString(str))
            return false;
    return true;
};

/**
 * @description Checks if a given number is non negative
 * @param {number} num the number to check
 * @returns {boolean} true if the number is greater than or equal to 0 and false otherwise
 */
export const checkNonNegativeNumber = (num: number): boolean => {
    return (num >= 0); 
};

/**
 * @description Checks if a given number is negative
 * @param {number} num the number to check
 * @returns {boolean} true if the number is less than 0 and false otherwise
 */
export const checkNegativeNumber = (num: number): boolean => {
    return (num < 0); 
};

/**
 * @description Tests a given string to see if it is a valid email
 * @param {string} email the string to validate
 * @returns {boolean} true if the string is valid and false otherwise
 */
export const checkEmail = (email: string): boolean => {
    return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.toLowerCase()));
};

/**
 * @description Checks if a given string is a valid name 
 * (doesen't contain any illegal characters)
 * @param {string} name the string to validate
 * @returns {boolean} true if the string contains no illegal characters 
 * and false otherwise
 */
export const checkName = (name: string): boolean => {
    if(name.trim() !== '') 
        return ((name.length >= 1) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\d]{1,20}$/.test(name));
    return false;
};

/**
 * @description Checks if a given string is a valid date format
 * @param {string} dateStr the string to validate
 * @returns {boolean} true if the string is a valid date and false otherwise
 */
export const checkDate = (dateStr: string): boolean => {
    return !isNaN(Date.parse(dateStr));
};

/**
 * @description Checks if a given string is a valid time
 * @param {string} timeStr the string to validate
 * @returns {boolean} true if the string is a valid time and false otherwise
 */
export const checkTime = (timeStr: string): boolean => {
    return (/^([01]\d|2[0-3]):?([0-5]\d)$/.test(timeStr));
};

/**
 * @description Checks if a given string is a valid phone number
 * @param {string} phoneStr the string to validate
 * @returns {boolean} true if the string is a valid phone number and false otherwise
 */
 export const checkPhoneNumber = (phoneStr: string): boolean => {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneStr));
};