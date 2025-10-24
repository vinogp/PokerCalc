import { Card } from './card.js';

export class Deck {
    constructor() {
        this.cards = [];
        this.generate();
    }

    generate() {
        this.cards = [];
        for (let rank of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'])
            for (let suit of ['h', 'd', 'c', 's']) {
                this.cards.push(new Card(rank, suit));
            }
    }

    remove_card(card) {
        if (!this.contains(card)) throw new Error(`В колоде нет карты ${card.to_string()}`);
        this.cards = this.cards.filter(c => Card.neq(c, card));
    }

    remove_known_cards(cards) {
        for (let card of cards) this.remove_card(card);
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        if (this.cards.length === 0) throw new Error('Колода пуста');
        return this.cards.pop();
    }

    draw_multiple(count) {
        if (this.cards.length < count) throw new Error(`Недостаточно карт: нужно ${count}, есть ${this.cards.length}`);
        const res = [];
        for (let i = 0; i < count; i++) {
            res.push(this.draw());
        }
        return res;
    }

    contains(card) {
        return this.cards.some(
            deck_card => Card.eq(deck_card, card)
        );
    }

    copy() {
        const d = new Deck();
        d.cards = this.cards.map(card => new Card(card.rank, card.suit));
        return d;
    }
}