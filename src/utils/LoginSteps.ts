import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { getEnv } from "../utils/env";
import { expect } from "@playwright/test";

export async function login(page: Page) {
	const { email, password } = getEnv();

	const loginPage = new LoginPage(page);
	await loginPage.login(email, password);

	const homePage = new HomePage(page);
	await expect(homePage.browseEventsLink).toBeVisible();
}
