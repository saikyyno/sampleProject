export function canRegister(email: string, password: string): boolean {
    if (!email.includes("@")) return false;
    return password.length >= 8;
}