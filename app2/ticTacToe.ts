
export enum Player {
	one,
	two
}
export interface TicTacToeInterface {
	move: (row: number, col: number, player: number) => void
}

export class TicTacToe implements TicTacToeInterface {

	private rowsWinCounter: number[];
	private colsWinCounter: number[];

	private diagonalCounter: number = 0;
	private antiDiagonalCounter: number = 0;

	private boardSize = 0;

	private playerOne = 1;
	private playerTwo = -1;

	/**
	 *
	 */
	constructor(boardSize) {
		this.boardSize = boardSize;
		this.rowsWinCounter = new Array(boardSize).fill(0);
		this.colsWinCounter = new Array(boardSize).fill(0);
	}

	move = (row: number, col: number, player: Player) => {
		if (row >= this.boardSize || col >= this.boardSize) {
			throw new Error("Illegal board placement");
		}

		this.rowsWinCounter[row] = this.rowsWinCounter[row] + this.counterCalc(player);
		this.colsWinCounter[col] = this.colsWinCounter[col] + this.counterCalc(player);
		console.log(`rowsWinCounter = ${JSON.stringify(this.rowsWinCounter, null, 2)}`);
		console.log(`colsWinCounter = ${JSON.stringify(this.colsWinCounter, null, 2)}`);


		if (row === col) {
			this.diagonalCounter = this.diagonalCounter + this.counterCalc(player);
			console.log(`diagonalCounter = ${this.diagonalCounter}`);

		}

		if (row + col === this.boardSize - 1) {
			this.antiDiagonalCounter = this.antiDiagonalCounter + this.counterCalc(player);
			console.log(`antiDiagonalCounter = ${this.antiDiagonalCounter}`);
		}

		if (this.rowsWinCounter[row] === this.boardSize || this.colsWinCounter[col] === this.boardSize || this.diagonalCounter === this.boardSize || this.antiDiagonalCounter === this.boardSize) {
			console.log(`Player ${player} wins !!!!`);
			return;
		}
	}

	private counterCalc = (player: Player): number => {
		switch (player) {
			case Player.one:
				return this.playerOne;
			case Player.two:
				return this.playerTwo;
			default:
				return 0;
		}
	}

}