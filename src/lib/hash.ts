import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash password for storing in DB
 */
export const hashPassword = async (password: string) => {
    if (!password) {
        throw new Error("Password is required");
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
};


export const matchPass = async (password: string, hashedPassword: string) => {
    if (!password || !hashedPassword) {
        return false;
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};