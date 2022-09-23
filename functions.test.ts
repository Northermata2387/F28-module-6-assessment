import { run } from "jest"

const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    // CODE HERE

    test('check  to see if length is the same after running the function', () => {
        let array = [1, 2, 3, 4, 5]
        let result = shuffleArray(array)
        expect(array.length).toBe(result.length)
    })

    test('check that all the same items are in the array', () => {
        //create array
        // run through shuffle array function
        // Check to make sure all original calues are included in new array
        let array = [1, 2, 3, 4, 5]
        let result = shuffleArray(array)

        expect(result).toEqual(expect.arrayContaining(array))

        // let myVar = true

        // for(let i = 0; i < result.length; i++) {
        //     if (array.includes(result[i]) === false) {
        //         myVar = false
        //         return
        //     }
        // }

        // expect(myVar).toBe(true)
    })

})

// Make sure to run npm i chromedriver@latest