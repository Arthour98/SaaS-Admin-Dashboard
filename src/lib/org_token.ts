import { randomBytes } from "crypto";

export default function createOrgToken() {
    let token = randomBytes(32).toString('hex').slice(0, 32);
    return token;
}



