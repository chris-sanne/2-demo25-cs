import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);
const poem = 'A leaf falls, The wind sighs—Time moves.';
const quotes = [
    "In three words I can sum up everything I've learned about life: it goes on.",
    "Happiness depends upon ourselves.",
    "Do or do not. There is no try.",
    "Life is what happens when you're busy making other plans.",
    "The unexamined life is not worth living."
];

server.set('port', port);
server.use(express.static('public'));
server.use(express.json());

function randomPoem() {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function getPoem(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function getQuote(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send(randomPoem()).end();
}

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post("/tmp/sum/:a/:b", (req, res, next) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    const sum = a + b;
    res.status(HTTP_CODES.SUCCESS.OK).json({ sum }).end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});