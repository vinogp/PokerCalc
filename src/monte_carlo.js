import { Card, parse_card, parse_board } from './card.js';
import { Deck } from './deck.js';
import { evaluate_7_cards } from './evaluator.js';

export function calc_one_iter(data) {
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

export function calc(data, iters) {
    let wins = 0;
    let ties = 0;
    let loses = 0;
    let res;

    for (let i = 0; i < iters; i++) {
        res = calc_one_iter(data);
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
    const by_bl = {
        0: 50000,
        3: 20000,
        4: 10000,
        5: 5000
    };

    let iters = by_bl[data.board.length] || 20000;
    iters = Math.floor(iters * Math.sqrt(data.players));

    const quality = {
        fast: 0.3,
        medium: 1,
        accurate: 2,
        ultra: 4
    }[data.quality];

    return Math.max(Math.floor(iters * quality), 1000);
}

export function get_batches(iters) {
    // Если мало итераций - делаем меньше батчей для уменьшения накладных расходов
    if (iters <= 1000) {
        return 100; // Минимум 100, максимум все итерации
    }

    if (iters <= 5000) {
        return 500; // Среднее количество
    }

    return 1000;
}

export function approx_time(time_hand, iters, players) {
    const time = iters * time_hand * (players + 1);
    console.log(`iters ${iters}, time_hand ${time_hand} ms, total players ${players + 1}`);
    console.log('time', time);

    if (time < 1000) return `${time.toFixed(1)} мс`;
    if (time < 10000) return `${(time / 1000).toFixed(1)} с`;
    if (time < 60000) return `${Math.round(time / 1000)} с`;

    const min = Math.floor(time / 60000);
    const sec = time / 1000 - min * 60;

    return `${min} мин ${Math.round(sec)} с`;
}