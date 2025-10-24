import { Card } from './card.js';

export function is_flush(hand) {
    return hand.every(card => card.suit === hand[0].suit);
}

export function is_straight(hand) {
    const sorted = hand.map(card => card.numeric_rank()).sort((a, b) => a - b);

    let is_normal_straight = true;
    for (let i = 1; i < 5; i++) {
        if (sorted[i] != sorted[i - 1] + 1) {
            is_normal_straight = false;
            break;
        }
    }
    if (is_normal_straight) return {flag: true, high: sorted[4]};

    if (sorted[0] === 0 && sorted[1] === 1 && sorted[2] === 2 && sorted[3] === 3 && sorted[4] === 12) return { flag: true, high: 3 };
    return { flag: false };
}

export function evaluate_5_cards(hand) {
    const flush = is_flush(hand);
    const straight = is_straight(hand);

    const numeric_ranks = hand.map(card => card.numeric_rank()).sort((a, b) => a - b);
    const rank_cnts = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [8, 0],
        [9, 0],
        [10, 0],
        [11, 0],
        [12, 0]
    ]);
    for (let rank of numeric_ranks) {
        rank_cnts.set(rank, rank_cnts.get(rank) + 1);
    }
    const rank_cnts_arr = Array.from(rank_cnts.entries()).filter(el => el[1] !== 0).sort((a, b) => (a[1] - b[1]) * 10e2 + (a[0] - b[0]));

    if (flush && straight.flag) return 8e10 + straight.high;//стрит-флеш
    if (rank_cnts_arr[0][1] === 1 && rank_cnts_arr[1][1] === 4) return 7e10 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//каре
    if (rank_cnts_arr[0][1] === 2 && rank_cnts_arr[1][1] === 3) return 6e10 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//фулл-хаус
    if (flush) return 5e10 + numeric_ranks[4] * 1e8 + numeric_ranks[3] * 1e6 + numeric_ranks[2] * 1e4 + numeric_ranks[1] * 1e2 + numeric_ranks[0];//флеш
    if (straight.flag) return 4e10 + straight.high;//стрит
    if (rank_cnts_arr[0][1] === 1 && rank_cnts_arr[1][1] === 1 && rank_cnts_arr[2][1] === 3)
        return 3e10 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//тройка
    if (rank_cnts_arr[0][1] === 1 && rank_cnts_arr[1][1] === 2 && rank_cnts_arr[2][1] === 2)
        return 2e10 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//2 пары
    if (rank_cnts_arr[0][1] === 1 && rank_cnts_arr[1][1] === 1 && rank_cnts_arr[2][1] === 1 && rank_cnts_arr[3][1] === 2)
        return 1e10 + rank_cnts_arr[3][0] * 1e6 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//пара
    return numeric_ranks[4] * 1e8 + numeric_ranks[3] * 1e6 + numeric_ranks[2] * 1e4 + numeric_ranks[1] * 1e2 + numeric_ranks[0];//старшая карта
}

export function evaluate_7_cards(combination) {
    const ALL_7C5_COMBINATIONS = [
        [0, 1, 2, 3, 4],
        [0, 1, 2, 3, 5],
        [0, 1, 2, 3, 6],
        [0, 1, 2, 4, 5],
        [0, 1, 2, 4, 6],
        [0, 1, 2, 5, 6],
        [0, 1, 3, 4, 5],
        [0, 1, 3, 4, 6],
        [0, 1, 3, 5, 6],
        [0, 1, 4, 5, 6],
        [0, 2, 3, 4, 5],
        [0, 2, 3, 4, 6],
        [0, 2, 3, 5, 6],
        [0, 2, 4, 5, 6],
        [0, 3, 4, 5, 6],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 6],
        [1, 2, 3, 5, 6],
        [1, 2, 4, 5, 6],
        [1, 3, 4, 5, 6],
        [2, 3, 4, 5, 6]
    ];
    let hand;
    let best_comb = null;
    let max_grade = 0;
    let grade = null;
    for (let ids of ALL_7C5_COMBINATIONS) {
        hand = [
            combination[ids[0]],
            combination[ids[1]],
            combination[ids[2]],
            combination[ids[3]],
            combination[ids[4]]
        ];

        grade = evaluate_5_cards(hand);
        if (grade > max_grade) {
            max_grade = grade;
            best_comb = hand;
        }
    }

    return max_grade;
}