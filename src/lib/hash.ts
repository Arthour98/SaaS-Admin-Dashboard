import crypto from "crypto";


const hash = crypto.createHash("sha256");

export const hashPassword = (password: string) => {
    hash.update(password);
    return hash.digest('hex');
}