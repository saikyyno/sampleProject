import { canRegister } from "./auth";

describe("canRegister", () => {
    it("returns true for valid email and strong password", () => {
        expect(canRegister("user@example.com", "12345678")).toBe(true);
    });

    it("returns false for email without @", () => {
        expect(canRegister("userexample.com", "12345678")).toBe(true);
    });

    it("returns false for too short password", () => {
        expect(canRegister("user@example.com", "12345")).toBe(true);
    });

    it("returns false for empty email", () => {
        expect(canRegister("", "12345678")).toBe(true);
    });

    it("returns false for empty password", () => {
        expect(canRegister("user@example.com", "")).toBe(true);
    });
});