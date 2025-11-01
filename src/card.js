export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    to_string() {
        const suits = {
            h: '♥',
            d: '♦',
            c: '♣',
            s: '♠'
        };
        return `${this.rank}${suits[this.suit]}`;
    }

    numeric_rank() {
        switch (this.rank) {
            case '2': return 0;
            case '3': return 1;
            case '4': return 2;
            case '5': return 3;
            case '6': return 4;
            case '7': return 5;
            case '8': return 6;
            case '9': return 7;
            case 'T': return 8;
            case 'J': return 9;
            case 'Q': return 10;
            case 'K': return 11;
            case 'A': return 12;
        }
    }

    static eq(card1, card2) {
        if (!(card1 instanceof Card && card2 instanceof Card)) return false;
        return card1.rank === card2.rank && card1.suit === card2.suit;
    }

    static neq(card1, card2) {
        return !Card.eq(card1, card2);
    }

    static from_data(data) {
        return new Card(data.rank, data.suit);
    }
}

/**
 * 
 * @param {string} str
 * @returns {Card}
 * Парсит строковое представление карты. Поддерживает следующие форматы: Ah, A♥ с точностью до регистра и пробелов
 */
export function parse_card(str) {
    const clean_str = str.replace(/\s+/g, '').replace('♥', 'h').replace('♦', 'd').replace('♣', 'c').replace('♠', 's');
    if (clean_str.length !== 2) throw new Error(`Неверный формат карты: ${str}`);
    const rank = clean_str.slice(0, 1).toUpperCase();
    const suit = clean_str.slice(1, 2).toLowerCase();

    const valid_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const valid_suits = ['h', 'd', 'c', 's'];

    if (!valid_ranks.includes(rank)) throw new Error(`Неверный формат карты: ${str}`);
    if (!valid_suits.includes(suit)) throw new Error(`Неверный формат карты: ${str}`);
    return new Card(rank, suit);
}

export function parse_board(str) {
    if (str.replace(/\s+/g, '').length === 0) return [];
    const arr = str.replace(/\s+/g, '').split(',');
    return arr.map(parse_card);
}