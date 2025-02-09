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

function generateDeckId() {
    let deck_id = "";
    const chars = "abcdefghijklmnopqrstuvwxyz"

    for (let i = 0; i < 5; i++) {
        const randomChar = Math.floor(Math.random() * chars.length);
        deck_id += chars[randomChar];
    }
    return deck_id;
}

function shuffleDeck(deck) {
    const shuffledDeck = {};

    for (const suit in deck) {
        const suitCards = [...deck[suit]];
        const shuffledSuit = [];

        while (suitCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * suitCards.length);
            const card = suitCards.splice(randomIndex, 1)[0];
            shuffledSuit.push(card);
        }
        shuffledDeck[suit] = shuffledSuit;
    }
    return shuffledDeck;
}

server.post("/temp/deck", (req, res, next) => {
    const deck_id = generateDeckId();
    const myDeck = JSON.parse(JSON.stringify(cardDeck));

    decks[deck_id] = myDeck;
    console.log(`New deck generated with ID: ${deck_id}`);
    console.log(decks[deck_id]);

    res.status(HTTP_CODES.SUCCESS.OK).json({ deck_id }).end();
});

server.patch("/temp/deck/shuffle/:deck_id", (req, res, next) => {
    const deck_id = req.params.deck_id;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }

    const shuffledDeck = shuffleDeck(decks[deck_id]);

    decks[deck_id] = shuffledDeck;
    
    console.log(`Deck with ID: ${deck_id} shuffled`);
    console.log(decks[deck_id]);

    res.status(HTTP_CODES.SUCCESS.OK).json(shuffledDeck).end();
});

server.get("/temp/deck/:deck_id", (req, res, next) => {
    const deck_id = req.params.deck_id;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }
    
    console.log(`Deck with ID: ${deck_id} retrieved`);
    console.log(decks[deck_id]);
    res.status(HTTP_CODES.SUCCESS.OK).json(decks[deck_id]).end();
});

server.get("/temp/deck/:deck_id/card", (req, res, next) => {
    const deck_id = req.params.deck_id;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No deck found").end();
    }

    const deck = decks[deck_id];
    const suits = Object.keys(deck);

    const randomSuitIndex = Math.floor(Math.random() * suits.length);
    const suit = suits[randomSuitIndex];

    if (deck[suit].length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send(`No cards left in the suit: ${suit}`).end();
    }

    const randomCardIndex = Math.floor(Math.random() * deck[suit].length);
    const card = deck[suit].splice(randomCardIndex, 1) [0];

    console.log(`Card ${card} of suit ${suit} drawn from deck with ID: ${deck_id}`);
    res.status(HTTP_CODES.SUCCESS.OK).json({ suit, card }).end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});