import { calc } from './monte_carlo.js';
import { Card } from './card.js';

let is_calculation = false;
let is_cancelled = false;
let start;
let end;

function start_calc() {
    is_calculation = true;
    is_cancelled = false;
    self.postMessage({
        type: 'START'
    });
    start = performance.now();
}

function end_calc() {
    is_calculation = false;
    is_cancelled = false;
    self.postMessage({
        type: 'END'
    });
    end = performance.now();
}

let last_upd_progress = 0;
const progress_interval = 50;
function upd_progress(percent) {
    const now = Date.now();
    if (percent === 0 || percent === 100 || now - last_upd_progress >= progress_interval) {
        self.postMessage({
            type: 'PROGRESS',
            data: {
                percent: percent
            }
        });
        last_upd_progress = now;
    }
}

function cancel_calc() {
    if (is_calculation) {
        is_cancelled = true;
    }
}

function calculate(data, simulations, batches, batch_size) {
    let res = { win: 0, tie: 0 };
    let now_res;

    start_calc();
    for (let batch_id = 0; batch_id < batches; batch_id++) {
        if (is_cancelled) {
            end_calc();
            return;
        }
        now_res = calc(data, batch_size);
        upd_progress((batch_id + 1) / batches * 100);
        res.win += now_res.win;
        res.tie += now_res.tie;
    }
    end_calc();

    res.win /= batches;
    res.tie /= batches;

    self.postMessage({
        type: 'RESULTS',
        data: {
            result: res,
            time: end - start
        }
    });
}

self.addEventListener('message', event => {
    const { type, data } = event.data;

    switch (type) {
        case 'START':
            calculate({
                player: data.data.player.map(Card.from_data),
                board: data.data.board.map(Card.from_data),
                players: data.data.players
            }, data.simulations, data.batches, data.batch_size);
            break;

        case 'CANCEL':
            cancel_calc();
            break;
    }
})