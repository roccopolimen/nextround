/**
 * Checks if a string is non-empty
 * @param str the string to check
 * @returns returns true if the string is not just whitespace
 * and false otherwise
 */
function checkNonEmptyString(str: string){
    return (str.trim() !== '');
}

/**
 * Checks if an array of strings are all non-empty
 * @param strs the array of strings to check
 * @returns true if no string in the array is just whitespace
 * and false otherwise
 */
function checkArrayOfStrings(strs: Array<string>){
    for(let str of strs) {
        if(!checkNonEmptyString(str)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if a given number is positive
 * @param num the number to check
 * @returns true if the number is greater than 0 and false otherwise
 */
function checkPositiveNumber(num: number){
    return (num > 0); 
}

/**
 * Checks if a given number is negative
 * @param num the number to check
 * @returns true if the number is less than 0 and false otherwise
 */
function checkNegativeNumber(num: number){
    return (num < 0); 
}

/**
 * Tests a given string to see if it is a valid email
 * @param email the string to validate
 * @returns true if the string is valid and false otherwise
 */
function checkEmail(email: string){
    return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.toLowerCase()));
}

/**
 * Checks if a given string is a valid name 
 * (doesen't contain any illegal characters)
 * @param name the string to validate
 * @returns true if the string contains no illegal characters 
 * and false otherwise
 */
function checkName(name: string) {
    if(name.trim() !== '') {
        return((name.length >= 1) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\d]{1,20}$/.test(name));
    }
    return false;
}

/**
 * Checks if a given string is a valid date format
 * @param dateStr the string to validate
 * @returns true if the string is a valid date and false otherwise
 */
function checkDate(dateStr: string){
    const parts = dateStr.split('/').map((n) => parseInt(n));
    parts[0] -= 1;
    const date = new Date(parts[2], parts[0], parts[1]);
    return date.getMonth() === parts[0] && date.getDate() === parts[1] && date.getFullYear() === parts[2];
}

/**
 * Checks if a given string is a valid time
 * @param timeStr the string to validate
 * @returns true if the string is a valid time and false otherwise
 */
function checkTime(timeStr: string){
    return (/^([01]\d|2[0-3]):?([0-5]\d)$/.test(timeStr));
}


export {
    checkNonEmptyString,
    checkArrayOfStrings,
    checkPositiveNumber,
    checkNegativeNumber,
    checkEmail,
    checkName,
    checkDate,
    checkTime
}