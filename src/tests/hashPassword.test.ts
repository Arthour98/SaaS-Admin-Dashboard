import bcrypt from "bcrypt";
import { hashPassword } from "@/lib/hash";

describe("hashPassword", () => {
    it("should hash the password", async () => {
        const password = "mypassword";

        const hash = await hashPassword(password);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);

        const isMatch = await bcrypt.compare(password, hash);

        expect(isMatch).toBe(true);
    });
});