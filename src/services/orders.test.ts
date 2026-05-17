import { createOrder } from "./orders.ts";

it("calls repo.save with correct userId", async () => {
    const mockRepo = { save: jest.fn().mockResolvedValue("order-1") };
    const result = await createOrder("user-1", mockRepo);
    expect(mockRepo.save).toHaveBeenCalledWith("user-1");
    expect(result).toBe("order-1");
});