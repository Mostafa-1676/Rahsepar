import countryData from './country_neighbors.json' with { type: "json" };

class Game {
    constructor() {
        this.usedCountries = new Set();
        this.currentCountry = null;
        this.currentPlayer = 1;
        this.isStarted = false;
    }

    startGame(initCountry) {
        if (!countryData[initCountry]) {
            throw new Error("Invalid country!"); 
        }
        this.usedCountries.add(initCountry);
        this.currentCountry = initCountry;
        this.isStarted = true;
        return `Game started with ${initCountry}`;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getCurrentCountry() {
        return this.currentCountry;
    }

    getValidNeighbors() {
        if (!this.currentCountry) return [];
        return countryData[this.currentCountry].filter(
            neighbor => !this.usedCountries.has(neighbor)
        );
    }

    playTurn(nextCountry) {
        const validNeighbors = this.getValidNeighbors();

        if (!countryData[nextCountry]) {
            return { success: false, message: "Invalid country name!" };
        }

        if (this.isGameOver()) {
            return {
                success: true,
                gameOver: true,
                winner: this.currentPlayer === 1 ? 2 : 1,
                message: `Game Over! Player ${this.currentPlayer === 1 ? 2 : 1} wins!`
            };
        }

        if (!validNeighbors.includes(nextCountry)) {
            return {
                success: false,
                message: `This country is not a ${this.currentCountry}'s neighbor or has been used.`
            };
        }

        this.usedCountries.add(nextCountry);
        this.currentCountry = nextCountry;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;

        return {
            success: true,
            message: `Turn: Player ${this.currentPlayer}`
        };
    }

    isGameOver() {
        return this.getValidNeighbors().length === 0;
    }

    getUsedCountries() {
        return Array.from(this.usedCountries);
    }

    reset(initCountry) {
        this.usedCountries = new Set([initCountry]);
        this.currentCountry = initCountry;
        this.currentPlayer = 2;
        this.isStarted = true;
    }
}

export default Game;