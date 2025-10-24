class SimpleTestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.resultsContainer = document.getElementById('results');
        this.summaryContainer = document.getElementById('summary');
    }

    // Добавить тест
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async testAsync(name, testFunction) {
        this.tests.push({ name, testFunction, async: true });
    }

    // Засечь время выполнения функции
    measureTime(fn, ...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        return {
            result,
            time: end - start
        };
    }

    // Запустить все тесты
    async runAll() {
        this.passed = 0;
        this.failed = 0;
        this.resultsContainer.innerHTML = '';

        console.log('🚀 Starting tests...');

        for (let i = 0; i < this.tests.length; i++) {
            await this.runTest(this.tests[i], i);
        }

        this.showSummary();
    }

    // Запустить один тест
    async runTest(testCase, index) {
        const testDiv = document.createElement('div');
        testDiv.className = 'test';
        testDiv.id = `test-${index}`;

        try {
            let time;
            if (testCase.async) {
                const start = performance.now();
                await testCase.testFunction();  // Просто await!
                time = performance.now() - start;
            } else {
                const result = this.measureTime(() => testCase.testFunction());
                time = result.time;
            }

            testDiv.classList.add('pass');
            testDiv.innerHTML = `✅ ${testCase.name} <span class="time">${time.toFixed(2)}ms</span>`;
            this.passed++;
            console.log(`✅ ${testCase.name}, time ${time.toFixed(2)}`);
        } catch (error) {
            testDiv.classList.add('fail');
            testDiv.innerHTML = `❌ ${testCase.name} <div class="error">${error.message}</div>`;
            this.failed++;
            console.log(`❌ ${testCase.name}, error ${error.message}`);
            console.log(error);
        }

        this.resultsContainer.appendChild(testDiv);
    }

    // Показать итоги
    showSummary() {
        const total = this.passed + this.failed;
        const successRate = total > 0 ? Math.round((this.passed / total) * 100) : 0;

        this.summaryContainer.innerHTML = `
                    <div class="summary">
                        <h3>📊 Test Summary</h3>
                        <p>Total: ${total} tests</p>
                        <p>✅ Passed: ${this.passed}</p>
                        <p>❌ Failed: ${this.failed}</p>
                        <p>📈 Success rate: ${successRate}%</p>
                    </div>
                `;
    }

    // Assertions
    assert(condition, message = "Assertion failed") {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEquals(actual, expected, message) {
        if (!eq(actual, expected)) {
            throw new Error(message || `Expected: ${JSON.stringify(expected)}, but got: ${JSON.stringify(actual)}`);
        }
    }

    assertNotEquals(actual, expected, message) {
        if (eq(actual, expected)) {
            throw new Error(message || `Expected not: ${JSON.stringify(expected)}, but got: ${JSON.stringify(actual)}`);
        }
    }

    assertTrue(condition, message = "Expected true") {
        this.assert(condition === true, message);
    }

    assertFalse(condition, message = "Expected false") {
        this.assert(condition === false, message);
    }

    assertThrows(fn, expectedMessage = null, message = "Expected function to throw") {
        try {
            fn();
            throw new Error(message); // Если не бросила ошибку - тест падает
        } catch (error) {
            // Если ожидали конкретное сообщение ошибки - проверяем его
            if (expectedMessage && !error.message.includes(expectedMessage)) {
                throw new Error(`Expected error message to contain "${expectedMessage}", but got: "${error.message}"`);
            }
            // Если дошли сюда - тест проходит (функция бросила ошибку как ожидалось)
        }
    }

    assertNotThrows(fn, message = "Expected function not to throw") {
        try {
            return fn();
        } catch (error) {
            throw new Error(`${message}. Got error: ${error.message}`);
        }
    }

    assertEqualsArray(actual, expected, message) {
        let cond = true;

        if (actual.length !== expected.length) cond = false;

        if (cond)
            for (let i = 0; i < actual.length; i++)
                if (!eq(actual[i], expected[i]))
                    cond = false;
        this.assertTrue(cond, message || `Expected: ${JSON.stringify(expected)}, but got: ${JSON.stringify(actual)}`);
    }

    assertNotEqualsArray(actual, expected, message) {
        let cond = true;

        if (actual.length !== expected.length) cond = false;

        if (cond)
            for (let i = 0; i < actual.length; i++)
                if (!eq(actual[i], expected[i]))
                    cond = false;
        this.assertFalse(cond, message || `Expected: ${JSON.stringify(expected)}, but got: ${JSON.stringify(actual)}`);
    }

    // Бенчмарк функции
    benchmark(name, fn, iterations = 1000) {
        const { time } = this.measureTime(() => {
            for (let i = 0; i < iterations; i++) {
                fn();
            }
        });

        const avgTime = time / iterations;

        const benchDiv = document.createElement('div');
        benchDiv.className = 'performance';
        benchDiv.innerHTML = `
                    📊 <strong>${name}</strong><br>
                    Iterations: ${iterations}<br>
                    Total time: ${time.toFixed(2)}ms<br>
                    Average time: ${avgTime.toFixed(4)}ms<br>
                    Operations per second: ${(1000 / avgTime).toFixed(0)}
                `;

        this.resultsContainer.appendChild(benchDiv);
        console.log(`📊 ${name}: ${avgTime.toFixed(4)}ms per operation`);
    }
}

// Создаем глобальный тест-раннер
const tester = new SimpleTestRunner();

// Глобальные функции для удобства
function runAllTests() {
    tester.runAll();
}

function clearResults() {
    document.getElementById('results').innerHTML = '';
    document.getElementById('summary').innerHTML = '';
    tester.passed = 0;
    tester.failed = 0;
}
// Автозапуск тестов при загрузке (опционально)
// document.addEventListener('DOMContentLoaded', runAllTests);

function eq(obj1, obj2) {
    // Сравнение примитивов и null
    if (obj1 === obj2) return true;

    // Проверка на null и тип
    if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key) || !eq(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}