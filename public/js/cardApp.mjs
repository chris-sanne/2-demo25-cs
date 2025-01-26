"use strict";

const btnNewDeck = document.getElementById("btnNewDeck");
const inputSearch = document.getElementById("inputSearch");
const btnShowDeck = document.getElementById("btnShowDeck");
const btnShuffleDeck = document.getElementById("btnShuffleDeck");
const btnDrawCard = document.getElementById("btnDrawCard");
const cardImage = document.getElementById("cardImage");
        
btnNewDeck.addEventListener("click", () => {
    fetch("/temp/deck", {method: "POST",

    }).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to generate a new deck");
        }
        return response.json();
    }).then((data) => {
        const deck_id = data.deck_id;
        console.log("New deck created with ID: ", deck_id);
        alert("New deck created successfully! Check your server logs for the deck ID.");
    }).catch((error) => {
        console.log(error);
        alert("Failed to generate a new deck. Please try again.");
    });
});

btnShowDeck.addEventListener("click", (event) => {
    event.preventDefault();

    const deck_id = inputSearch.value;
    if (!deck_id) {
        alert("Please enter a valid deck ID.");
        return;
    }

    fetch(`/temp/deck/${deck_id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Deck with ID ${deck_id} not found`);
            }
            return response.json();
        }).then((deck) => {
            console.log(`Deck with ID ${deck_id}:`, deck);
            alert(`Deck loaded! Check the console for details.`);
            renderDeck(deck, deck_id); //Remove later

        }).catch((error) => {
            console.error(error);
            alert(`Error: ${error.message}`);
        });
});

btnShuffleDeck.addEventListener("click", (event) => {
    event.preventDefault();
    const deck_id = inputSearch.value; 
    if (!deck_id) {
        alert("Please enter a valid deck ID.");
        return;
    }

    fetch(`/temp/deck/shuffle/${deck_id}`, {method: "PATCH"})

    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Deck not found or shuffle failed");
        }
    })
    .then(shuffledDeck => {
        console.log("Deck shuffled: ", shuffledDeck);
        alert("Deck shuffled!");
    })
    .catch(error => {
        console.error("Error shuffling deck: ", error);
        alert("Error shuffling deck!");
    });
});

btnDrawCard.addEventListener("click", (event) => {
    event.preventDefault();
    const deck_id = inputSearch.value;
    if (!deck_id) {
        alert("Please enter a valid deck ID.");
        return;
    }

    fetch(`/temp/deck/${deck_id}/card`)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("No card left in the deck or deck not found");
        }
    })
    .then(cardData => {

        const card = cardData.card;
        const suit = cardData.suit;

        const cardMapping = {
            "Ace": "A",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            "10": "0",
            "Jack": "J",
            "Queen": "Q",
            "King": "K"
        };

        const suitMapping = {
            "Spades": "S",
            "Diamonds": "D",
            "Clubs": "C",
            "Hearts": "H"
        };

        const cardStr = cardMapping[card];
        const suitStr = suitMapping[suit];

        const imageUrl = `https://deckofcardsapi.com/static/img/${cardStr}${suitStr}.png`;

        cardImage.src = imageUrl;
        console.log(`Card drawn: ${card} of ${suit}`);
    })
    .catch(error => {
        console.error("Error drawing card: ", error);
        alert("Error drawing card!");
    });
});

// Either tidy up with css or remove altogether later
function renderDeck(deck, deck_id) {
    const output = document.createElement("div");
    output.id = "deckOutput";
    output.innerHTML = `
        <h2>Deck ID: ${deck_id}</h2>
        <pre>${JSON.stringify(deck, null, 2)}</pre>
    `;

    const existingOutput = document.getElementById("deckOutput");
    if (existingOutput) {
        existingOutput.remove();
    }

    document.body.appendChild(output);
};