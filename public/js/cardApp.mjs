"use strict";

let darkmode = localStorage.getItem("darkmode");
const btnToggleTheme = document.getElementById("btnToggleTheme");
const enableDarkmode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
}

const disableDarkmode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
};

if (darkmode === "active") {
    enableDarkmode();
}

btnToggleTheme.addEventListener("click", ()  => {
    darkmode = localStorage.getItem("darkmode");
    
    if (darkmode !== "active") {
        enableDarkmode();
    } else {
        disableDarkmode();
    }
});

const btnNewDeck = document.getElementById("btnNewDeck");
const inputSearch = document.getElementById("inputSearch");
const btnShowDeck = document.getElementById("btnShowDeck");
const btnShuffleDeck = document.getElementById("btnShuffleDeck");
const btnDrawCard = document.getElementById("btnDrawCard");
const cardImage = document.getElementById("cardImage");
let amountOfDecks = 0;
        
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
        showMessage(`New deck created with ID: ${deck_id}`, "success");
        amountOfDecks++;
        if (amountOfDecks === 1) {
            console.log(`You have ${amountOfDecks} deck.`);
        } else {
            console.log(`You have ${amountOfDecks} decks.`);
        }
    }).catch((error) => {
        console.log(error);
        alert("Failed to generate a new deck. Please try again.", "error");
        showMessage("Failed to generate a new deck. Please try again.", "error");
    });
});

btnShowDeck.addEventListener("click", (event) => {
    event.preventDefault();

    const deck_id = inputSearch.value;

    if (amountOfDecks <1) {
        showMessage(`You have no decks. Generate a deck first.`, "error");
    } else if (!deck_id) {
        showMessage(`Please enter a valid deck ID.`, "error");
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
            showMessage(`Deck loaded with ID: ${deck_id}`, "success");

        }).catch((error) => {
            console.error(error);
            //I found these to be annoying: alert(`Error: ${error.message}`);
        });
});

btnShuffleDeck.addEventListener("click", (event) => {
    event.preventDefault();
    const deck_id = inputSearch.value; 
    if (amountOfDecks <1) {
        showMessage(`You have no decks. Generate a deck first.`, "error");
    } else if (!deck_id) {
        showMessage(`Please enter a valid deck ID.`, "error");
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
        showMessage(`Deck shuffled!`, "success");
        //I found these to be annoying: alert("Deck shuffled!");
    })
    .catch(error => {
        console.error("Error shuffling deck: ", error);
        //I found these to be annoying: alert("Error shuffling deck!");
    });
});

btnDrawCard.addEventListener("click", (event) => {
    event.preventDefault();
    const deck_id = inputSearch.value;

    if (amountOfDecks <1) {
        showMessage(`You have no decks. Generate a deck first.`, "error");
    } else if (!deck_id) {
        showMessage(`Please enter a valid deck ID.`, "error");
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
        //I found these to be annoying: alert("Error drawing card!"); 
    });
});

function showMessage(message, type = "success") {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = message;
    messageBox.className = "";
    messageBox.classList.add(type);
    messageBox.style.display = "block";
    messageBox.style.opacity = 1;

    setTimeout(() => {
        messageBox.style.transition = "opacity 1.5s";
        messageBox.style.opacity = "0";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 2000);
    }, 5000);
}