import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
	readonly page: Page;
	readonly browseEventsLink: Locator;
	readonly adminMenuButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.browseEventsLink = page.getByRole("link", { name: "Browse Events →" });
		this.adminMenuButton = page.getByRole("button", { name: "Admin" });
	}
}
