
export const validate_username = (username: string, length: number) => {
    if (username.length < length) {
        return false;
    }
    else {
        return true;
    }
}

export const validate_password = (password: string, length: number) => {
    if (password.length < length) {
        return false;
    }
    else {
        return true;
    }
}

export const validate_email = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

