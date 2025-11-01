
/**
 * Класс, который слушает события ввода, валидирует ввод и генерит события input_upd
 */
export class InputListener {
    constructor() {
        this.fields = {
            card1: { element: null, hint: null, isValid: false },
            card2: { element: null, hint: null, isValid: false },
            board: { element: null, hint: null, isValid: true }, // board может быть пустым
            quality: { element: null },
            players_num: { element: null }
        };
        this.calculateBtn = document.getElementById('calc-btn');
        this.init();
    }

    get is_valid() {
        return this.fields.card1.isValid && this.fields.card2.isValid && this.fields.board.isValid;
    }

    init() {
        // Находим элементы
        this.fields.card1.element = document.getElementById('player-card1');
        this.fields.card1.hint = document.getElementById('hint-card1');
        this.fields.card2.element = document.getElementById('player-card2');
        this.fields.card2.hint = document.getElementById('hint-card2');
        this.fields.board.element = document.getElementById('board-cards');
        this.fields.board.hint = document.getElementById('hint-board');
        this.fields.quality.element = document.getElementById('quality-selector');
        this.fields.players_num.element = document.getElementById('num-players');

        // Вешаем обработчики
        this.fields.card1.element.addEventListener('input', () => this.validateCard1());
        this.fields.card2.element.addEventListener('input', () => this.validateCard2());
        this.fields.board.element.addEventListener('input', () => this.validateBoard());
        this.fields.quality.element.addEventListener('input', () => this.event());
        this.fields.players_num.element.addEventListener('input', () => this.event());

        // Валидация при загрузке
        this.validateAll();
    }

    event() {
        const event = new CustomEvent('input_upd', {
            detail: {
                player_1: this.fields.card1.element.value,
                player_2: this.fields.card2.element.value,
                players_num: this.fields.players_num.element.value,
                board: this.fields.board.element.value,
                quality: this.fields.quality.element.value,
            }
        });

        document.dispatchEvent(event);
    }

    validateCard1() {
        this.event();
        const value = this.fields.card1.element.value.trim();
        const result = this.validateSingleCard(value);
        this.updateFieldState('card1', result);
        this.updateCalculateButton();
    }

    validateCard2() {
        this.event();
        const value = this.fields.card2.element.value.trim();
        const result = this.validateSingleCard(value);
        this.updateFieldState('card2', result);
        this.updateCalculateButton();
    }

    validateBoard() {
        this.event();
        const value = this.fields.board.element.value.trim();

        if (value === '') {
            // Пустой board - валидно
            this.updateFieldState('board', { isValid: true, message: '' });
        } else {
            // Проверяем все карты в board
            const cards = value.split(',').map(card => card.trim());
            const results = cards.map(card => this.validateSingleCard(card));
            const allValid = results.every(r => r.isValid);

            if (allValid) {
                this.updateFieldState('board', {
                    isValid: true,
                    message: `Валидные карты: ${cards.length}`
                });
            } else {
                const invalidCards = cards.filter((card, i) => !results[i].isValid);
                this.updateFieldState('board', {
                    isValid: false,
                    message: `Неверные карты: ${invalidCards.join(', ')}`
                });
            }
        }

        this.updateCalculateButton();
    }

    validateSingleCard(cardString) {
        if (!cardString) {
            return { isValid: false, message: 'Введите карту' };
        }

        // Автоматически приводим к верхнему регистру
        const upperCard = cardString.toUpperCase();    

        // Проверяем форматы: Ah, A♥, A h
        const formats = [
            /^[2-9TJQKA][HDCS]$/,                          // Ah
            /^[2-9TJQKA][♥♦♣♠]$/,                          // A♥
            /^[2-9TJQKA]\s*[♥♦♣♠HDCS]$/,                   // A ♥
            /^[2-9TJQKA]\s*[HDCS]\s*[♥♦♣♠]?$/              // A h ♥
        ];

        const isValidFormat = formats.some(regex => regex.test(upperCard));

        if (!isValidFormat) {
            return {
                isValid: false,
                message: 'Формат: Ah, A♥, A h (2-9,T,J,Q,K,A + h,d,c,s,♥,♦,♣,♠)'
            };
        }

        return { isValid: true, message: '✓ Валидная карта' };
    }

    updateFieldState(fieldName, result) {
        const field = this.fields[fieldName];
        field.isValid = result.isValid;

        // Обновляем CSS классы
        field.element.parentElement.classList.toggle('valid', result.isValid);
        field.element.parentElement.classList.toggle('error', !result.isValid);

        // Обновляем подсказку
        field.hint.textContent = result.message;
        field.hint.className = `hint ${result.isValid ? 'valid' : 'error'}`;
    }

    updateCalculateButton() {
        const allValid = this.fields.card1.isValid &&
            this.fields.card2.isValid &&
            this.fields.board.isValid;

        this.calculateBtn.disabled = !allValid;
    }

    validateAll() {
        this.validateCard1();
        this.validateCard2();
        this.validateBoard();
    }

    // Проверка дубликатов карт
    checkForDuplicates() {
        const allCards = [
            this.fields.card1.element.value.trim(),
            this.fields.card2.element.value.trim(),
            ...this.fields.board.element.value.split(',').map(c => c.trim())
        ].filter(card => card !== '');

        const uniqueCards = new Set(allCards.map(card => this.normalizeCard(card)));

        if (uniqueCards.size !== allCards.length) {
            return { hasDuplicates: true, message: 'Обнаружены дублирующиеся карты' };
        }

        return { hasDuplicates: false, message: '' };
    }

    normalizeCard(cardString) {
        // Приводим карту к единому формату для сравнения
        return cardString.toUpperCase().replace(/[♥♦♣♠]/g, (suit) => {
            const suitMap = { '♥': 'H', '♦': 'D', '♣': 'C', '♠': 'S' };
            return suitMap[suit];
        }).replace(/\s+/g, '');
    }
}