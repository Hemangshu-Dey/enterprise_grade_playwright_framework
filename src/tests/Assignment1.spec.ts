import { test, expect } from "@playwright/test";
import { login } from "../utils/LoginSteps";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test("Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.", async ({
	page,
}) => {
	let loginPage: LoginPage;
	let homePage: HomePage;

	loginPage = new LoginPage(page);
	await loginPage.gotoLoginPage();
	await login(page);

	homePage = new HomePage(page);
	await expect(homePage.browseEventsLink).toBeVisible();

	await page.goto("/admin/events");
	const eventTitle = `Test Event ${Date.now()}`;
	await page.locator("#event-title-input").fill(eventTitle);
	await page.locator("#admin-event-form textarea").fill("Test description");
	await page.getByLabel("City").fill("Mumbai");
	await page.getByLabel("Venue").fill("Test Venue");
	await page
		.getByRole("textbox", { name: "Event Date & Time*" })
		.fill("2030-10-31T10:00");
	await page.getByLabel("Price ($)").fill("100");
	await page.getByLabel("Total Seats").fill("50");
	await page.locator("#add-event-btn").click();
	await expect(page.getByText("Event created!")).toBeVisible();

	await page.goto("/events");
	const eventCards = page.getByTestId("event-card");
	await expect(eventCards.first()).toBeVisible();
	const targetCard = eventCards.filter({ hasText: eventTitle }).first();
	await expect(targetCard).toBeVisible({ timeout: 5000 });
	const seatsBeforeBooking = parseInt(
		await targetCard.getByText("seat").first().innerText(),
	);

	await targetCard.getByTestId("book-now-btn").click();

	const ticketCount = page.locator("#ticket-count");
	await expect(ticketCount).toHaveText("1");
	await page.getByLabel("Full Name").fill("Test Student");
	await page.locator("#customer-email").fill("test.student@example.com");
	await page.getByPlaceholder("+91 98765 43210").fill("9876543210");
	await page.locator(".confirm-booking-btn").click();

	const bookingRefEl = page.locator(".booking-ref").first();
	await expect(bookingRefEl).toBeVisible();
	const bookingRef = (await bookingRefEl.innerText()).trim();
	expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());

	await page.getByRole("link", { name: "View My Bookings" }).click();
	await expect(page).toHaveURL("/bookings");
	const bookingCards = page.locator("#booking-card");
	await expect(bookingCards.first()).toBeVisible();
	const matchingCard = bookingCards.filter({
		has: page.locator(".booking-ref", { hasText: bookingRef }),
	});
	await expect(matchingCard).toBeVisible();
	await expect(matchingCard).toContainText(eventTitle);

	await page.goto("/events");
	await expect(eventCards.first()).toBeVisible();
	const updatedCard = eventCards.filter({ hasText: eventTitle }).first();
	await expect(updatedCard).toBeVisible();
	const seatsAfterBooking = parseInt(
		await updatedCard.getByText("seat").first().innerText(),
	);
	expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});
