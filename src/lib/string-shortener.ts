
export const string_shortener = (str: string) => {
    if (str.length >= 9) {
        const new_str = str.substring(0, 9);
        return new_str + "...";
    }
    else if (str.length < 9) {
        return str;
    }
}