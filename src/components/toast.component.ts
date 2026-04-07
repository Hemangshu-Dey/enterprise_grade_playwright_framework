import { expect, Page } from "@playwright/test";

export class ToastHelper {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async expectMessage(message: string) {
		await expect(this.page.getByText(message)).toBeVisible();
	}
}
