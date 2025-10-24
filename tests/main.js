import { Card } from '../src/card.js';
import { parse_data } from '../src/main.js';

tester.test('parsing_data', () => {
    tester.assertEquals(parse_data('A h', 'T ♥', 'ad, 7s, 3h', 4), {
        player: [new Card('A', 'h'), new Card('T', 'h')],
        board: [new Card('A', 'd'), new Card('7', 's'), new Card('3', 'h')],
        players: 4
    })
})