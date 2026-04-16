import { test, expect } from "@playwright/test";
import { login } from "../utils/LoginSteps";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { getEnv } from "../utils/env";

test("refund eligible for single ticket booking", async ({ page }) => {
	let loginPage: LoginPage;
	let homePage: HomePage;
	const { email } = getEnv();

	loginPage = new LoginPage(page);
	await loginPage.gotoLoginPage();
	await login(page);
	homePage = new HomePage(page);
	await homePage.browseEventsLink.click();

	await page.goto("/events");
	await page
		.getByTestId("event-card")
		.first()
		.getByTestId("book-now-btn")
		.click();

	await page.getByLabel("Full Name").fill("Hemangshu Dey");
	await page.locator("#customer-email").fill(email);
	await page.getByPlaceholder("+91 98765 43210").fill("1234567890");
	await page.locator(".confirm-booking-btn").click();

	await page.getByRole("link", { name: "View My Bookings" }).click();
	await expect(page).toHaveURL("/bookings");
	await page.getByRole("link", { name: "View Details" }).first().click();
	await expect(page.getByText("Booking Information")).toBeVisible();

	const bookingRef = await page.locator("span.font-mono.font-bold").innerText();
	const eventTitle = await page.locator("h1").innerText();
	expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

	await page.locator("#check-refund-btn").click();
	await expect(page.locator("#refund-spinner")).toBeVisible();
	await expect(page.locator("#refund-spinner")).not.toBeVisible({
		timeout: 6000,
	});

	const result = page.locator("#refund-result");
	await expect.soft(result).toBeVisible();
	await expect.soft(result).toContainText("Eligible for refund");
	await expect
		.soft(result)
		.toContainText("Single-ticket bookings qualify for a full refund");
});

test("refund not eligible for group ticket booking", async ({ page }) => {
	let loginPage: LoginPage;
	let homePage: HomePage;
	loginPage = new LoginPage(page);
	const { email } = getEnv();

	await loginPage.gotoLoginPage();
	await login(page);
	homePage = new HomePage(page);
	await homePage.browseEventsLink.click();

	await page.goto("/events");
	await page
		.getByTestId("event-card")
		.first()
		.getByTestId("book-now-btn")
		.click();
	await page.locator('button:has-text("+")').click();
	await page.locator('button:has-text("+")').click();

	await page.getByLabel("Full Name").fill("Hemangshu Dey");
	await page.locator("#customer-email").fill(email);
	await page.getByPlaceholder("+91 98765 43210").fill("1234567890");
	await page.locator(".confirm-booking-btn").click();

	await page.getByRole("link", { name: "View My Bookings" }).click();
	await expect(page).toHaveURL("/bookings");
	await page.getByRole("link", { name: "View Details" }).first().click();
	await expect(page.getByText("Booking Information")).toBeVisible();

	const bookingRef = await page.locator("span.font-mono.font-bold").innerText();
	const eventTitle = await page.locator("h1").innerText();
	expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

	await page.locator("#check-refund-btn").click();
	await expect(page.locator("#refund-spinner")).toBeVisible();
	await expect(page.locator("#refund-spinner")).not.toBeVisible({
		timeout: 6000,
	});

	const result = page.locator("#refund-result");
	await expect(result).toBeVisible();
	await expect(result).toContainText("Not eligible for refund");
	await expect(result).toContainText(
		"Group bookings (3 tickets) are non-refundable",
	);
});
