import { step, TestSettings, Until, By } from '@flood/element'

export const settings: TestSettings = {
	clearCache: false,
	disableCache: false,
	clearCookies: false,
	loopCount: -1,
	duration: '-1',
	actionDelay: '2s',
	stepDelay: '2s',
	waitTimeout: '60s',
	screenshotOnFailure: true,
}

/**
 * Author: Antonio Jimenez : antonio@flood.io
 * The internet - heroku App
 * @version 1.1
 */

const URL = 'https://the-internet.herokuapp.com'

export default () => {
	step('Test: 01 - Homepage', async (browser) => {
		await browser.visit(URL)
		await browser.wait(Until.elementIsVisible(By.css('#content > h1')))
		const pageTextVerify = By.visibleText('Welcome to the-internet')
		await browser.wait(Until.elementIsVisible(pageTextVerify))
	})

	step('Test: 02 - Multiple Windows', async (browser) => {
		await browser.visit(URL + '/windows')
		await browser.wait(Until.elementIsVisible(By.css('#content > div > h3')))
		const pageTextVerify = By.visibleText('Opening a new window')
		await browser.wait(Until.elementIsVisible(pageTextVerify))
	})

	step('Test: 03 - Open a new Tab', async (browser) => {
		const linkHref = await browser.findElement(By.css('#content > div > a'))
		await linkHref.click()
		await browser.waitForNewPage()
		const pageTextVerify = By.visibleText('New Window')
		await browser.wait(Until.elementIsVisible(pageTextVerify))
		const pages = await browser.pages
		assert.strictEqual(pages.length, 2, 'There should be 2 windows')
	})
}
