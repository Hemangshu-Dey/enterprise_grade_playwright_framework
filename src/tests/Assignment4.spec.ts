import { test, expect, Page } from "@playwright/test";
const API_URL = "https://api.eventhub.rahulshettyacademy.com/api";

const YAHOO_USER = { email: "hemangshu1904@yahoo.com", password: "1234@Asdf" };
const GMAIL_USER = { email: "hemangshu@gmail.com", password: "1234@Asdf" };

type User = {
	email: string;
	password: string;
};

async function loginAs(page: Page, user: User) {
	await page.goto("");
	await page.getByPlaceholder("you@email.com").fill(user.email);
	await page.getByLabel("Password").fill(user.password);
	await page.locator("#login-btn").click();
	await expect(
		page.getByRole("link", { name: "Browse Events →" }),
	).toBeVisible();
}

test("Gmail user sees Access Denied when viewing yahoo user booking", async ({
	page,
	request,
}) => {
	const loginRes = await request.post(`${API_URL}/auth/login`, {
		data: { email: YAHOO_USER.email, password: YAHOO_USER.password },
	});
	expect(loginRes.ok()).toBeTruthy();
	const { token } = await loginRes.json();
	const eventsRes = await request.get(`${API_URL}/events`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	expect(eventsRes.ok()).toBeTruthy();
	const eventsData = await eventsRes.json();
	const eventId = eventsData.data[0].id;

	const bookingRes = await request.post(`${API_URL}/bookings`, {
		headers: { Authorization: `Bearer ${token}` },
		data: {
			eventId,
			customerName: "Yahoo User",
			customerEmail: YAHOO_USER.email,
			customerPhone: "9999999999",
			quantity: 1,
		},
	});
	expect(bookingRes.ok()).toBeTruthy();
	const yahooBookingId = (await bookingRes.json()).data.id;
	await loginAs(page, GMAIL_USER);

	await page.goto(`/bookings/${yahooBookingId}`, {
		waitUntil: "networkidle",
	});

	await expect(page.getByText("Access Denied")).toBeVisible();
	await expect(
		page.getByText("You are not authorized to view this booking"),
	).toBeVisible();
});
