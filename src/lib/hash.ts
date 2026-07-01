import crypto from "crypto";


const hash = crypto.createHash("sha256");

export const hashPassword = (password: string ) => {
    if (typeof password == undefined || typeof password == null) {
        return;
    }
    hash.update(password);
    return hash.digest('hex');
}