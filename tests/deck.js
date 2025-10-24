import { Deck } from '../src/deck.js';
import { Card } from '../src/card.js';

tester.test('generating deck', () => {
    const deck = new Deck();

    tester.assertEquals(deck.cards.length, 52);
    for (let rank of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']) {
        for (let suit of ['s', 'h', 'd', 'c']) {
            tester.assertTrue(deck.contains(new Card(rank, suit)));
        }
    }
})

tester.test('deck draw', () => {
    const deck = new Deck();

    const card = deck.draw();
    tester.assertEquals(deck.cards.length, 51);
    tester.assertTrue(card instanceof Card);
})

tester.test('deck draw_multiple', () => {
    const deck = new Deck();

    const cards = deck.draw_multiple(5);
    tester.assertEquals(deck.cards.length, 47);
    tester.assertEquals(cards.length, 5);
    for (let card of cards) {
        tester.assertTrue(card instanceof Card);
    }
})

tester.test('deck draw throws an error when empty', () => {
    const deck = new Deck();
    deck.draw_multiple(52);

    tester.assertThrows(() => { deck.draw() }, 'Колода пуста');
})

tester.test('deck draw_multiple throws an error when there is not enough cards', () => {
    const deck = new Deck();
    deck.draw_multiple(50);

    tester.assertThrows(() => { deck.draw_multiple(3) }, 'Недостаточно карт: нужно 3, есть 2');
})

tester.test('deck remove card', () => {
    const deck = new Deck();
    deck.remove_card(new Card('A', 'h'));

    tester.assertEquals(deck.cards.length, 51);
    tester.assertFalse(deck.contains(new Card('A', 'h')));

    tester.assertThrows(() => { deck.remove_card(new Card('A', 'h')) }, 'В колоде нет карты A♥');
})

tester.test('deck remove_known_cards', () => {
    const deck = new Deck();
    deck.remove_known_cards([
        new Card('A', 'h'),
        new Card('K', 'h'),
        new Card('K', 'd')
    ]);

    tester.assertEquals(deck.cards.length, 49);
})

tester.test('deck shuffle', () => {
    const deck1 = new Deck();
    const deck2 = new Deck();

    deck1.shuffle();

    tester.assertEquals(deck1.cards.length, 52);

    let difference = 0;
    for (let i = 0; i < 52; i++) {
        if (Card.neq(deck1.cards[i], deck2.cards[i])) difference += 1;
    }

    tester.assertTrue(difference >= 10, `Колода должна перемешаться (difference = ${difference})`);
})

tester.test('deck copy', () => {
    const deck_1 = new Deck();
    deck_1.remove_card(new Card('T', 'h'));

    const deck_2 = deck_1.copy();
    tester.assertEqualsArray(deck_1.cards, deck_2.cards);

    deck_2.shuffle();
    deck_2.draw();

    tester.assertEquals(deck_1.cards.length, 51);
})

tester.benchmark('deck initializing', () => { return new Deck(); }, 1000);