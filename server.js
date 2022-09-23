const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '2e57d40d0c8140e59609ef2e35af8a54',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

//Middleware to serve the html file
app.use('/', express.static(path.join(__dirname, '/public/index.html')))

//Endpoints to serve the js file
app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, `/public/index.js`))
  })

//Endpoints to serve the css file
app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, `/public/index.css`))
  })

//Middleware to serve files from the public folder
app.use(express.static(path.join(__dirname, '/public')))


app.get('/api/robots', (req, res) => {
    try {
        rollbar.info('User veiwing all Bots')
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        rollbar.critical('ERROR GETTING BOTS')
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        rollbar.info('Bots shuffled')
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        rollbar.critical('ERROR GETTING FIVE BOTS')
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.info('Player loses')
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            rollbar.info('Player wins')
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.warning('ERROR DUELING')
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        rollbar.info('User gets updated player record')
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        rollbar.warning('ERROR GETTING PLAYER STATS')
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

// In case of Rollbar Error
app.use(rollbar.errorHandler())

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})