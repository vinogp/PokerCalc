import { Card, parse_card, parse_board } from './card.js';
import { Deck } from './deck.js';
import { evaluate_7_cards } from './evaluator.js';
import { calc, simulations_cnt } from './monte_carlo.js';

async function main() {
    const player_card_1 = document.getElementById('player-card1').value;
    const player_card_2 = document.getElementById('player-card2').value;
    const board_cards = document.getElementById('board-cards').value;
    const players_num = document.getElementById('num-players').value;

    const data = parse_data(player_card_1, player_card_2, board_cards, players_num);
    const simulations = simulations_cnt(data)
    const res = await calc(data, simulations);

    console.log(res);

    const win = document.getElementById('win-value');
    const tie = document.getElementById('tie-value');

    win.innerHTML = `${res.win.toFixed(3) * 100}%`;
    tie.innerHTML = `${res.tie.toFixed(3) * 100}%`;
}

export function parse_data(player_card_1, player_card_2, board, players_num) {
    return {
        player: [
            parse_card(player_card_1),
            parse_card(player_card_2)
        ],
        board: parse_board(board),
        players: players_num
    }
}

window.main = main;