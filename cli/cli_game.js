import readline from 'readline'; 
import Game from '../logic/game_logic.js';
import { resolve } from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const game = new Game();

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

async function runInteractiveGame() {
    console.log('Welcome to the Rahsepar Game!');
    console.log('Type "exit" at any time to quit.\n');

    let startCountry = await ask('🌍 Enter a starting country: ')

    if (startCountry.toLowerCase() === 'exit') {
        rl.close();
        return;
    }

    try {
        console.log(game.startGame(startCountry));

    } catch (e) {
        console.error('❌ Invalid starting country. Please restart the game.');
        rl.close();
        return;
    }

    while (!game.isGameOver()) {
        const player = game.getCurrentPlayer();
        const current = game.getCurrentCountry();
        const valid = game.getValidNeighbors();

        console.log(`Turn: Player ${player}`);
        console.log(`Current country: ${current}`);
        console.log(`Valid neighbors: ${valid.join(', ') || 'None'}`);

        if (valid.length === 0) break;

        let move = await ask('Enter next country: ')

        if (move.toLowerCase() === 'exit') {
            console.log('Exiting the game. Bye!');
            break;
        }

        const result = game.playTurn(move);

        if (!result.success) {
            console.log(`❌ ${result.message}`);
        } else {
            console.log(`✅ ${result.message}`);
        }
    }

    console.log('\n🏁 Game over!');
    console.log('Countries used: ', game.getUsedCountries().join(', '));
    rl.close();
}

runInteractiveGame();
