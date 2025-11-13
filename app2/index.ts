import { TicTacToe, TicTacToeInterface, Player } from "./ticTacToe";
console.log("test");

try {
	const game: TicTacToeInterface = new TicTacToe(3);

	//game.move(4, 0, Player.one);
	game.move(2, 0, Player.one);
	game.move(0, 1, Player.two);
	game.move(1, 1, Player.one);
	game.move(1, 0, Player.two);
	game.move(0, 2, Player.one);

} catch (error) {
	console.log(error);
}




