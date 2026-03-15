export function createOrder(userId: string, repo: { save: (u: string) => Promise<string> }) {
    if (!userId) throw new Error("No user");
    return repo.save(userId);
}