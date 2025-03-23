describe("GET /users", () => {
  test("Returning all users", async () => {
    const response = await fetch("http://localhost:3000/users");
    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);
  });
});
