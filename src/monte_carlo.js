import { Card, parse_card, parse_board } from './card.js';
import { Deck } from './deck.js';
import { evaluate_7_cards } from './evaluator.js';

export async function calc_one_iter(data) {
    const player = data.player;
    const board = [...data.board];

    const deck = new Deck();
    deck.remove_known_cards(data.player);
    deck.remove_known_cards(data.board);
    deck.shuffle();

    while (board.length < 5) board.push(deck.draw());

    const opponents = [];
    for (let i = 0; i < data.players; i++) {
        opponents.push(deck.draw_multiple(2));
    }

    const player_res = evaluate_7_cards([...player, ...board]);
    const opponents_res = opponents.map(opp => evaluate_7_cards([...opp, ...board]));

    if (opponents_res.every(r => r < player_res)) return 'win';
    if (opponents_res.every(r => r <= player_res)) return 'tie';
    return 'lose';
}

export async function calc(data, iters) {
    let wins = 0;
    let ties = 0;
    let loses = 0;
    let res;

    for (let i = 0; i < iters; i++) {
        res = await calc_one_iter(data);
        switch (res) {
            case 'win':
                wins += 1;
                break;
            case 'tie':
                ties += 1;
                break;
            case 'lose':
                loses += 1;
                break;
        }
    }

    return {
        win: wins / iters,
        tie: ties / iters,
        lose: loses / iters
    };
}

export function simulations_cnt(data) {
    return 1000;
}