import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

// Make sure to run npm i chromedriver@latest

// Write at least 2 tests. Describe callback for the shuffleArray function.

test('Draw button displays the div with id = “choices”', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.sleep(300)
    const choicesDiv = await driver.findElement(By.id('choices'))
    expect(choicesDiv).not.toBe('')

})

test('click “Add to Duo” button displays div with id=“player-duo”', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.sleep(300)
    await driver.findElement(By.xpath(`(//*[text()="Add to Duo"])[1]`)).click()

    const playerDuoDiv = await driver.findElement(By.id('player-duo'))
    const displayed = await playerDuoDiv.isDisplayed()

    expect(displayed).toBe(true)

})