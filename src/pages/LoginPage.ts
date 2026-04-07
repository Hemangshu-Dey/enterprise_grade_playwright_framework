import { type Locator, type Page } from "@playwright/test";
import { HomePage } from "./HomePage";

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly signinButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.emailInput = page.getByPlaceholder("you@email.com");
		this.passwordInput = page.locator("#password");
		this.signinButton = page.getByRole("button", { name: "Sign In" });
	}

	async gotoLoginPage() {
		await this.page.goto("/");
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.signinButton.click();
	}
}
