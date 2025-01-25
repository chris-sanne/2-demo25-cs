import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

const cardDeck = {
    "Clubs": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
    "Diamonds": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
    "Hearts": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
    "Spades": ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"],
}

const decks = {};

server.set('port', port);
server.use(express.static('public'));
//server.use(express.json()); no need?

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function generateDeckId() {
    let deck_id = "";
    const chars = "abcdefghijklmnopqrstuvwxyz"

    for (let i = 0; i < 5; i++) {
        const randomChar = Math.floor(Math.random() * chars.length);
        deck_id += chars[randomChar];
    }
    console.log("Deck ID generated. Returning to server.post call . . .");
    return deck_id;
}

function generateDeck() {
    fetch("/temp/deck")
        .then(response => response.json())
        .then(cardDeck => console.log(cardDeck));
}

server.get("/", getRoot);

server.post("/temp/deck", (req, res, next) => {
    const deck_id = generateDeckId();
    const myDeck = {...cardDeck};
    decks[deck_id] = myDeck;
    console.log(`Deck generated with ID: ${deck_id}`);
    console.log(decks[deck_id]);

    res.status(HTTP_CODES.SUCCESS.OK).send().end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});