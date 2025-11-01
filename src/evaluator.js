import { Card } from './card.js';

export function is_flush(hand) {
    const s = hand[0].suit;
    return hand[1].suit === s
        && hand[2].suit === s
        && hand[3].suit === s
        && hand[4].suit === s;
}

export function is_straight(hand) {
    const sorted = [
        hand[0].numeric_rank(),
        hand[1].numeric_rank(),
        hand[2].numeric_rank(),
        hand[3].numeric_rank(),
        hand[4].numeric_rank()
    ];

    for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 5; j++)
            if (sorted[j] < sorted[i])
                [sorted[j], sorted[i]] = [sorted[i], sorted[j]];

    if (sorted[0] + 1 === sorted[1]
        && sorted[1] + 1 === sorted[2]
        && sorted[2] + 1 === sorted[3]
        && sorted[3] + 1 === sorted[4]) return { flag: true, high: sorted[4] };

    if (sorted[0] === 0
        && sorted[1] === 1
        && sorted[2] === 2
        && sorted[3] === 3
        && sorted[4] === 12) return { flag: true, high: 3 };
    return { flag: false };
}

export function evaluate_5_cards(hand) {
    const flush = is_flush(hand);
    const straight = is_straight(hand);

    if (flush && straight.flag) return 8e10 + straight.high;//стрит-флеш

    //rank_cnts[i] -- кол-во карт значения i
    const numeric_ranks = [
        hand[0].numeric_rank(),
        hand[1].numeric_rank(),
        hand[2].numeric_rank(),
        hand[3].numeric_rank(),
        hand[4].numeric_rank()
    ];
    const rank_cnts = new Array(13).fill(0);
    rank_cnts[numeric_ranks[0]]++;
    rank_cnts[numeric_ranks[1]]++;
    rank_cnts[numeric_ranks[2]]++;
    rank_cnts[numeric_ranks[3]]++;
    rank_cnts[numeric_ranks[4]]++;

    //rank_cnts_arr -- массив всех встречающихся пар значение-кол-во встреч, отсортированных сначала по кол-ву, потом по значению по возрастанию
    const rank_cnts_arr = [];
    for (let i = 0; i < 13; i++)
        if (rank_cnts[i] > 0) rank_cnts_arr.push([i, rank_cnts[i]]);

    for (let i = 0; i < rank_cnts_arr.length - 1; i++) {
        for (let j = i + 1; j < rank_cnts_arr.length; j++) {
            if ((rank_cnts_arr[j][1] - rank_cnts_arr[i][1]) * 100 + (rank_cnts_arr[j][0] - rank_cnts_arr[i][0]) < 0) {
                [rank_cnts_arr[j], rank_cnts_arr[i]] = [rank_cnts_arr[i], rank_cnts_arr[j]];
            }
        }
    }

    if (rank_cnts_arr[0][1] === 1 && rank_cnts_arr[1][1] === 4) return 7e10 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//каре

    let is_triple;//если есть тройка, ее значение, иначе -1
    if (rank_cnts_arr[1][1] === 3) is_triple = rank_cnts_arr[1][0];
    else {
        if (rank_cnts_arr.length >= 3 && rank_cnts_arr[2][1] === 3) is_triple = rank_cnts_arr[2][0];
        else is_triple = -1;
    }

    const pairs = [];//все значения пар
    for (let i of rank_cnts_arr) {
        if (i[1] === 2) pairs.push(i[0]);
    }

    const is_pair = pairs.length === 1;
    const is_2_pairs = pairs.length === 2;

    if (is_pair && (is_triple !== -1)) return 6e10 + is_triple * 1e2 + pairs[0];//фулл-хаус
    if (flush) return 5e10 + rank_cnts_arr[4][0] * 1e8 + rank_cnts_arr[3][0] * 1e6 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//флеш
    if (straight.flag) return 4e10 + straight.high;//стрит
    if (is_triple !== -1) return 3e10 + is_triple * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//тройка
    if (is_2_pairs) return 2e10 + pairs[1] * 1e4 + pairs[0] * 1e2 + rank_cnts_arr[0][0];//2 пары
    if (is_pair) return 1e10 + pairs[0] * 1e6 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//пара
    return rank_cnts_arr[4][0] * 1e8 + rank_cnts_arr[3][0] * 1e6 + rank_cnts_arr[2][0] * 1e4 + rank_cnts_arr[1][0] * 1e2 + rank_cnts_arr[0][0];//старшая карта
}

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

export function evaluate_7_cards(combination) {
    let max_grade = 0;
    let grade = null;
    for (let ids of ALL_7C5_COMBINATIONS) {
        grade = evaluate_5_cards([
            combination[ids[0]],
            combination[ids[1]],
            combination[ids[2]],
            combination[ids[3]],
            combination[ids[4]]
        ]);
        if (grade > max_grade) max_grade = grade;
    }

    return max_grade;
}