import { step, By, Until, TestSettings, TestData } from '@flood/element'
import * as assert from 'assert'

export const settings: TestSettings = {
	loopCount: 1,
	clearCache: false,
	clearCookies: false,
	responseTimeMeasurement: 'step',
	userAgent: 'I AM ROBOT',
	actionDelay: '1s',
	stepDelay: '1s',
}

const data = [{ age: 42 }, { age: 16 }, { age: 29 }, { age: 54 }, { age: 31 }]

interface Row {
	age: number
}

TestData.fromData<Row>(data).shuffle().circular()

export default () => {
	step('1. Start', async (browser) => {
		await browser.visit('https://challenge.flood.io')

		const button = By.css('#new_challenger > input.btn.btn-xl.btn-default')
		await browser.wait(Until.elementIsVisible(button))

		await browser.takeScreenshot()
		await browser.click(button)
	})

	step('2. Age', async (browser, row: Row) => {
		const select = By.id('challenger_age')
		await browser.wait(Until.elementIsVisible(select))
		await browser.selectByValue(select, row.age.toString())

		await browser.takeScreenshot()

		await browser.click('input.btn')
	})

	step('3. Largest Order', async (browser) => {
		const table = By.css('table tbody tr td:first-of-type label')
		await browser.wait(Until.elementIsVisible(table))

		const orderElements = await browser.findElements(table)
		assert(orderElements.length > 0, 'expected to find orders on this page')

		const orderIDs = await Promise.all(orderElements.map((element) => element.text()))

		// Find largest number by sorting and picking the first item
		const largestOrder = orderIDs
			.map(Number)
			.sort((a, b) => a - b)
			.reverse()[0]

		// Click label with order ID
		await browser.click(By.visibleText(String(largestOrder)))

		// Fill in text field
		const field = By.id('challenger_largest_order')
		await browser.type(field, String(largestOrder))

		await browser.takeScreenshot()
	})

	step('4. Easy', async (browser) => {
		await browser.click('input.btn')

		await browser.takeScreenshot()
	})

	step('5. One Time Token', async (browser) => {
		await browser.click('input.btn')

		await browser.wait(Until.elementTextMatches('span.token', /\d+/))
		const element = await browser.findElement('span.token')
		const token = await element.text()
		await browser.type(By.id('challenger_one_time_token'), token)

		await browser.takeScreenshot()
	})

	step('6. Done', async (browser) => {
		await browser.click('input.btn')

		await browser.wait(Until.elementIsVisible('h2'))
		const element = await browser.findElement('h2')
		const completionText = await element.text()
		assert.equal(completionText, "You're Done!")

		await browser.takeScreenshot()
	})
}
