import { calc_one_iter, calc } from '../src/monte_carlo.js';
import { parse_data } from '../src/main.js';

async function test_calc_one_iter(data) {
    const result = await calc_one_iter(data);

    // Проверяем что результат один из ожидаемых
    const validResults = ['win', 'tie', 'lose'];
    tester.assertTrue(validResults.includes(result), `Expected win/tie/lose, got: ${result}`);
}

async function test_calc(data, iterations, minWin, maxWin, minTie, maxTie) {
    const results = await calc(data, iterations);

    // Проверяем структуру результата
    tester.assertTrue('win' in results, 'Results should have win property');
    tester.assertTrue('tie' in results, 'Results should have tie property');

    // Проверяем что проценты в разумных пределах
    tester.assertTrue(results.win >= 0 && results.win <= 1, 'Win should be 0-1');
    tester.assertTrue(results.tie >= 0 && results.tie <= 1, 'Tie should be 0-1');

    // Проверяем диапазоны (только если указаны)
    if (minWin !== undefined) {
        tester.assertTrue(results.win >= minWin && results.win <= maxWin,
            `Win ${results.win}, should be between ${minWin}-${maxWin}`);
    }

    if (minTie !== undefined) {
        tester.assertTrue(results.tie >= minTie && results.tie <= maxTie,
            `Tie ${results.tie}, should be between ${minTie}-${maxTie}`);
    }
}

tester.testAsync('calc_one_iter', async () => {
    await test_calc_one_iter(parse_data('Ah', 'Kh', '', 1))
    await test_calc_one_iter(parse_data('2h', '2d', '', 1))
    await test_calc_one_iter(parse_data('Ah', 'Ad', '', 1))
    await test_calc_one_iter(parse_data('Ah', 'Kh', 'Qh, Jh, Th', 1))
    await test_calc_one_iter(parse_data('Ah', 'Kh', 'Qh, Jh, Th, 9h, 8h', 1))
})

tester.testAsync('calc', async () => {
    await test_calc(parse_data('Ah', 'Kh', '', 1), 100, 0.6, 0.9, 0, 0.05)        // AKs ~65%
    await test_calc(parse_data('Ah', 'Ad', '', 1), 100, 0.75, 0.9, 0, 0.03)        // AA ~85%
    await test_calc(parse_data('2h', '7d', '', 1), 100, 0.25, 0.4, 0.02, 0.06)        // 72o ~35%
    await test_calc(parse_data('Ah', 'Kh', 'Qh, Jh, Th', 1), 100, 1, 1, 0, 0) // Флеш-дро
})

/*tester.benchmark('calc', async () => {

})*/