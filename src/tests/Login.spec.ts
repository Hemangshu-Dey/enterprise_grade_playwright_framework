import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { getEnv } from "../utils/env";
import { HomePage } from "../pages/HomePage";

test.describe("Login test", () => {
	test("Given valid credentials, when the user signs in, the events homepage should be visible", async ({
		page,
	}) => {
		const { email, password } = getEnv();

		const loginPage = new LoginPage(page);
		await loginPage.gotoLoginPage();
		await loginPage.login(email, password);

		const homePage = new HomePage(page);
		await expect(homePage.browseEventsLink).toBeVisible();
	});

	test("Given valid credentials, when the user signs in, the session should persist after page refresh", async ({
		page,
	}) => {
		const { email, password } = getEnv();

		const loginPage = new LoginPage(page);
		await loginPage.gotoLoginPage();
		await loginPage.login(email, password);
		const homePage = new HomePage(page);
		await expect(homePage.browseEventsLink).toBeVisible();
		await page.reload();
		await expect(homePage.browseEventsLink).toBeVisible();
	});

	test("Given invalid username, when the user signs in, an error message should be displayed", async ({
		page,
	}) => {
		const { email, password } = getEnv();

		const loginPage = new LoginPage(page);
		await loginPage.gotoLoginPage();
		await loginPage.login("random@gmail.com", password);
		await expect(page.getByText("Invalid email or password")).toBeVisible();
	});

	test("Given invalid password, when the user signs in, an error message should be displayed", async ({
		page,
	}) => {
		const { email } = getEnv();

		const loginPage = new LoginPage(page);
		await loginPage.gotoLoginPage();
		await loginPage.login(email, "1234567890");
		await expect(page.getByText("Invalid email or password")).toBeVisible();
	});
});
