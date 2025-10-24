import { Card, parse_card, parse_board } from '../src/card.js';

tester.test('creating the card', () => {
    const card = new Card('T', 'd');
    tester.assertEquals(card.rank, 'T');
    tester.assertEquals(card.suit, 'd');
});

tester.test('card to string', () => {
    const card = new Card('T', 'd');
    tester.assertEquals(card.to_string(), 'T♦');
});

tester.test('card equal', () => {
    const card1 = new Card('T', 'd');
    const card2 = new Card('T', 'd');
    const card3 = new Card('T', 'h');

    tester.assertTrue(Card.eq(card1, card2));
    tester.assertFalse(Card.eq(card1, card3));

    tester.assertFalse(Card.neq(card1, card2));
    tester.assertTrue(Card.neq(card1, card3));
});

tester.test('card\'s numeric rank', () => {
    const cases = [
        { rank: '2', num: 0 },
        { rank: '3', num: 1 },
        { rank: '4', num: 2 },
        { rank: '5', num: 3 },
        { rank: '6', num: 4 },
        { rank: '7', num: 5 },
        { rank: '8', num: 6 },
        { rank: '9', num: 7 },
        { rank: 'T', num: 8 },
        { rank: 'J', num: 9 },
        { rank: 'Q', num: 10 },
        { rank: 'K', num: 11 },
        { rank: 'A', num: 12 }
    ];

    for (let test_case of cases) {
        const card = new Card(test_case.rank, 'h');
        tester.assertEquals(card.numeric_rank(), test_case.num);
    }
})

tester.test('parsing card', () => {
    let card = parse_card('Td');
    tester.assertEquals(card.rank, 'T');
    tester.assertEquals(card.suit, 'd');

    card = parse_card('t S');
    tester.assertEquals(card.rank, 'T');
    tester.assertEquals(card.suit, 's');

    card = parse_card('T♥');
    tester.assertEquals(card.rank, 'T');
    tester.assertEquals(card.suit, 'h');

    tester.assertThrows(() => { parse_card('t') }, 'Неверный формат карты: t');
    tester.assertThrows(() => { parse_card('tdd') }, 'Неверный формат карты: tdd');
    tester.assertThrows(() => { parse_card('s2') }, 'Неверный формат карты: s2');
});

tester.test('parsing board', () => {
    let board = parse_board('');
    tester.assertEquals(board.length, 0);

    board = parse_board('Ah,   t   ♥ , 7S');
    tester.assertEqualsArray(board, [
        new Card('A', 'h'),
        new Card('T', 'h'),
        new Card('7', 's')
    ]);

    tester.assertThrows(() => { parse_board('Ah, 0a') });
    tester.assertThrows(() => { parse_board('Ah      Kd') });
})

tester.benchmark('parsing card', () => { parse_card('  A  H  ') }, 1000);