import createOrgToken from "@/lib/org_token";


test('value of createOrgToken', () => {
    const result = createOrgToken();

    expect(result).toHaveLength(32)
    expect(typeof result).toBe("string")
});
