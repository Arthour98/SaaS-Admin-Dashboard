import crypto from "crypto";
import { hashPassword } from "@/lib/hash";

describe("hashPassword", () => {
    it("should return a sha256 hash", () => {
        const password = "mypassword";

        const expected = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        const result = hashPassword(password);

        expect(result).toBe(expected);
    });
});