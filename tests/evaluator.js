import { is_straight, is_flush, evaluate_5_cards, evaluate_7_cards } from '../src/evaluator.js';
import { Card, parse_board } from '../src/card.js';

function test_eval_5(hand_str, expected) {
    tester.assertEquals(evaluate_5_cards(parse_board(hand_str)), expected);
}

function test_eval_7(hand_str, expected) {
    tester.assertEquals(evaluate_7_cards(parse_board(hand_str)), expected);
}

tester.test('is_flush', () => {
    let hand = parse_board('Ah, 5h, 9h, Th, Qh');
    tester.assertTrue(is_flush(hand));

    hand = parse_board('Ah, 5d, 9h, Th, Qc');
    tester.assertFalse(is_flush(hand));
})

tester.test('is_straight', () => {
    let hand = parse_board('9h, 7h, Jh, Th, 8h');
    tester.assertEquals(is_straight(hand), { flag: true, high: 9 });

    hand = parse_board('3h, 5h, Ah, 2h, 4h');
    tester.assertEquals(is_straight(hand), { flag: true, high: 3 });

    hand = parse_board('9h, 6h, Jh, Th, 8h');
    tester.assertEquals(is_straight(hand), { flag: false });
})

tester.benchmark('is_flush', () => is_flush([
    new Card('A', 'h'),
    new Card('5', 'h'),
    new Card('9', 'h'),
    new Card('T', 'h'),
    new Card('Q', 'h')
]), 1e8);

tester.benchmark('is_straight', () => is_straight([
    new Card('7', 'h'),
    new Card('J', 'h'),
    new Card('9', 'h'),
    new Card('T', 'h'),
    new Card('8', 'h')
]), 1e7);

tester.test('evaluate_5_cards straight-flush', () => {
    test_eval_5('Th, Jh, Qh, Kh, Ah', 8_00_00_00_00_12);
    test_eval_5('9h, Th, Jh, Qh, Kh', 8_00_00_00_00_11);
    test_eval_5('5d, 6d, 7d, 8d, 9d', 8_00_00_00_00_07);
    test_eval_5('Ac, 2c, 3c, 4c, 5c', 8_00_00_00_00_03);
})

tester.test('evaluate_5_cards four-of-a-kind', () => {
    test_eval_5('Ah, Ad, Ac, As, Kh', 7_00_00_00_12_11);
    test_eval_5('Kh, Kd, Kc, Ks, Ah', 7_00_00_00_11_12);
    test_eval_5('Qh, Qd, Qc, Qs, Th', 7_00_00_00_10_08);
    test_eval_5('2h, 2d, 2c, 2s, 3h', 7_00_00_00_00_01);
})

tester.test('evaluate_5_cards full-house', () => {
    test_eval_5('Ah, Ad, Ac, Ks, Kh', 6_00_00_00_12_11);
    test_eval_5('Kh, Kd, Kc, As, Ah', 6_00_00_00_11_12);
    test_eval_5('Qh, Qd, Qc, Js, Jh', 6_00_00_00_10_09);
})

tester.test('evaluate_5_cards flush', () => {
    test_eval_5('Ah, Kh, Qh, Jh, 9h', 5_12_11_10_09_07);
    test_eval_5('Kd, Qd, Jd, 9d, 7d', 5_11_10_09_07_05);
    test_eval_5('Qc, Tc, 9c, 7c, 5c', 5_10_08_07_05_03);
})

tester.test('evaluate_5_cards straight', () => {
    test_eval_5('Ah, Kd, Qc, Js, Th', 4_00_00_00_00_12);
    test_eval_5('Kh, Qd, Jc, Ts, 9h', 4_00_00_00_00_11);
    test_eval_5('5h, 4d, 3c, 2s, Ah', 4_00_00_00_00_03);
    test_eval_5('9s, 8h, 7d, 6c, 5h', 4_00_00_00_00_07);
})

tester.test('evaluate_5_cards three-of-a-kind', () => {
    test_eval_5('Ah, Ad, Ac, Ks, Qh', 3_00_00_12_11_10);
    test_eval_5('Kh, Kd, Kc, As, Qh', 3_00_00_11_12_10);
    test_eval_5('Qh, Qd, Qc, As, Kh', 3_00_00_10_12_11);
})

tester.test('evaluate_5_cards 2-pairs', () => {
    test_eval_5('Ah, Ad, Ks, Kc, Qh', 2_00_00_12_11_10);
    test_eval_5('Ah, Ad, Qs, Qc, Kh', 2_00_00_12_10_11);
    test_eval_5('Kh, Kd, Qs, Qc, Ah', 2_00_00_11_10_12);
})

tester.test('evaluate_5_cards pair', () => {
    test_eval_5('Ah, Ad, Ks, Qc, Jh', 1_00_12_11_10_09);
    test_eval_5('Kh, Kd, As, Qc, Jh', 1_00_11_12_10_09);
    test_eval_5('Qh, Qd, As, Kc, Jh', 1_00_10_12_11_09);
})

tester.test('evaluate_5_cards high_card', () => {
    test_eval_5('Ah, Kd, Qc, Js, 9h', 12_11_10_09_07);
    test_eval_5('Ah, Kd, Qc, Js, 8h', 12_11_10_09_06);
    test_eval_5('Kh, Qd, Jc, Ts, 2h', 11_10_09_08_00);
})

tester.benchmark('evaluating 5 cards', () => {
    evaluate_5_cards([
        new Card('K', 'h'),
        new Card('K', 'd'),
        new Card('8', 's'),
        new Card('8', 'c'),
        new Card('T', 'h')
    ])
}, 1000)

tester.test('evaluate_7_cards', () => {
    // Стрит-флеш
    test_eval_7('Ah, Kh, Qh, Jh, Th, 2d, 3c', 8_00_00_00_00_12)  // Royal Flush
    test_eval_7('9h, Th, Jh, Qh, Kh, 2d, 3c', 8_00_00_00_00_11)  // Стрит-флеш до короля
    test_eval_7('Ac, 2c, 3c, 4c, 5c, Kd, Qd', 8_00_00_00_00_03)  // Steel Wheel

    // Каре
    test_eval_7('Ah, Ad, Ac, As, Kh, Qh, Jh', 7_00_00_00_12_11)  // Каре тузов + K
    test_eval_7('Kh, Kd, Kc, Ks, Ah, Ad, Qh', 7_00_00_00_11_12)  // Каре королей + A
    test_eval_7('Qh, Qd, Qc, Qs, Th, 9h, 8h', 7_00_00_00_10_08)  // Каре дам + T

    // Фулл-хаус
    test_eval_7('Ah, Ad, Ac, Kh, Kd, Qh, Jh', 6_00_00_00_12_11)  // AAA + KK
    test_eval_7('Kh, Kd, Kc, Ah, Ad, Qh, Jh', 6_00_00_00_11_12)  // KKK + AA
    test_eval_7('Qh, Qd, Qc, Jh, Jd, Th, 9h', 6_00_00_00_10_09)  // QQQ + JJ

    // Флеш
    test_eval_7('Ah, Kh, Qh, Jh, 9h, 2d, 3c', 5_12_11_10_09_07)  // Флеш A,K,Q,J,9
    test_eval_7('Kd, Qd, Jd, 9d, 7d, Ah, 2h', 5_11_10_09_07_05)  // Флеш K,Q,J,9,7
    test_eval_7('Qc, Tc, 9c, 7c, 5c, Ah, Kh', 5_10_08_07_05_03)  // Флеш Q,T,9,7,5

    // Стрит
    test_eval_7('Ah, Kd, Qc, Js, Th, 2h, 3h', 4_00_00_00_00_12)  // Стрит до туза
    test_eval_7('9h, Th, Jd, Qc, Ks, 2h, 3h', 4_00_00_00_00_11)  // Стрит до короля
    test_eval_7('5h, 4d, 3c, 2s, Ah, Kh, Qh', 4_00_00_00_00_03)  // Стрит A-5

    // Тройка
    test_eval_7('Ah, Ad, Ac, Kh, Qh, Jh, 9d', 3_00_00_12_11_10)  // AAA + K,Q
    test_eval_7('Kh, Kd, Kc, Ah, Qh, Jh, 9d', 3_00_00_11_12_10)  // KKK + A,Q
    test_eval_7('Qh, Qd, Qc, Ah, Kh, Jh, 9d', 3_00_00_10_12_11)  // QQQ + A,K

    // Две пары
    test_eval_7('Ah, Ad, Kh, Kd, Qh, Jh, 9d', 2_00_00_12_11_10)  // AA + KK + Q
    test_eval_7('Ah, Ad, Qh, Qd, Kh, Jh, 9d', 2_00_00_12_10_11)  // AA + QQ + K
    test_eval_7('Kh, Kd, Qh, Qd, Ah, Jh, 9d', 2_00_00_11_10_12)  // KK + QQ + A

    // Пара
    test_eval_7('Ah, Ad, Kh, Qh, Jh, 9d, 8c', 1_00_12_11_10_09)  // AA + K,Q,J
    test_eval_7('Kh, Kd, Ah, Qh, Jh, 9d, 8c', 1_00_11_12_10_09)  // KK + A,Q,J
    test_eval_7('Qh, Qd, Ah, Kh, Jh, 9d, 8c', 1_00_10_12_11_09)  // QQ + A,K,J

    // Старшая карта
    test_eval_7('Ah, Kd, Qc, Js, 9h, 8d, 7c', 12_11_10_09_07)  // A,K,Q,J,9
    test_eval_7('Kh, Qd, Jc, 3s, 9h, 8d, 7c', 11_10_09_07_06)  // K,Q,J,T,9
    test_eval_7('Ah, Kd, Qc, Ts, 9h, 8d, 7c', 12_11_10_08_07)  // A,K,Q,T,9
})

tester.benchmark('evaluating 7 cards', () => {
    evaluate_7_cards([
        new Card('2', 'd'),
        new Card('3', 'd'),
        new Card('A', 'h'),
        new Card('K', 'h'),
        new Card('Q', 'h'),
        new Card('J', 'h'),
        new Card('T', 'h'),
    ])
})