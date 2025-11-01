import { Card, parse_card, parse_board } from './card.js';
import { Deck } from './deck.js';
import { calc, simulations_cnt, get_batches, approx_time } from './monte_carlo.js';
import { InputListener } from './input_listener.js';
import { evaluate_7_cards } from './evaluator.js';
import { WorkerManager } from './worker_manager.js';

let listener;
let data;
let simulations;
let time_7_cards;
let worker_manager;

function show_time(msg) {
    document.getElementById('time-value').innerHTML = msg;
}
function handle_input(event) {
    if (listener.is_valid) {
        data = parse_data(event.detail.player_1, event.detail.player_2, event.detail.board, event.detail.players_num, event.detail.quality);
        simulations = simulations_cnt(data);
        show_time(approx_time(time_7_cards, simulations, data.players));
    } else {
        show_time('-');
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function measure_time_7_cards() {
    const random_rank = () => ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'][Math.floor(Math.random() * 13)];
    const random_suit = () => ['h', 'd', 's', 'c'][Math.floor(Math.random() * 4)];
    const random_card = () => new Card(random_rank(), random_suit());
    let start, end, cards, d;
    let time = 0;
    for (let i = 0; i < 100; i++) {
        d = new Deck();
        d.shuffle();
        cards = d.draw_multiple(7);

        start = performance.now();
        for (let j = 0; j < 10; j++) evaluate_7_cards(cards);
        end = performance.now();

        time += (end - start);
    }
    return time / 1000;
}

document.addEventListener('DOMContentLoaded', () => {
    listener = new InputListener();
    worker_manager = new WorkerManager();
    
    time_7_cards = measure_time_7_cards();
    console.log('time_7_cards:', time_7_cards);

    document.getElementById('calc-btn').addEventListener('click', () => worker_manager.start(data, simulations));
    document.addEventListener('input_upd', event => handle_input(event));
})

export function parse_data(player_card_1, player_card_2, board, players_num, quality) {
    return {
        player: [
            parse_card(player_card_1),
            parse_card(player_card_2)
        ],
        board: parse_board(board),
        players: Number(players_num),
        quality: quality
    }
}