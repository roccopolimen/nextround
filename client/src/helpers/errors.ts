//Retruns true if passed a non empty string
function checkNonEmptyString(str: string){
    return (str.trim() !== '');
}

//Returns true if every entry of an array is a non empty string
function checkArrayOfStrings(strs: Array<string>){
    let retbool = true;
    for(let str in strs) {
        if(!checkNonEmptyString(str)) {
            return false;
        }
    }
    return true;
}

//Returns true if passed a positive number
function checkPositiveNumber(num: number){
    return (num > 0); 
}

//Returns true if passed a negative number
function checkNegativeNumber(num: number){
    return (num < 0); 
}

//REGEX is for the current email format RFC2822
//Returns true if passed a valid email
//Param: string
function checkEmail(email: string){
    return (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.toLowerCase()));
}

//REGEX tests against chars that we do not want to have in the name
//Returns true if passed a valid last name
//Param: string
function checkName(name: string) {
    if(name.trim() !== '') {
        return((name.length >= 1) && /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,\d]{1,20}$/.test(name));
    }
    return false;
}

//Checks if input is a valid date in the form MM/DD/YYYY
//Param: string
function checkDate(dateStr: string){
    const parts = dateStr.split('/').map((n) => parseInt(n));
    parts[0] -= 1;
    const date = new Date(parts[2], parts[0], parts[1]);
    return date.getMonth() === parts[0] && date.getDate() === parts[1] && date.getFullYear() === parts[2];
}

//Checks if input is a valid millitary time (HH:MM)
//Param: string
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