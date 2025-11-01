import { get_batches } from './monte_carlo.js';

export class WorkerManager {
    constructor() {
        this.worker = new Worker('src/worker.js', { type: 'module' });
        this.worker.onmessage = event => {
            const { type, data } = event.data;
            switch (type) {
                case 'START':
                    document.getElementById('progress-fill').style.width = '0%';
                    document.getElementById('progress-text').textContent = '0%';
                    document.getElementById('progress').style.display = 'block';
                    document.getElementById('calc-btn').disabled = true;
                    break;
                case 'END':
                    document.getElementById('progress').style.display = 'none';
                    document.getElementById('calc-btn').disabled = false;
                    break;
                case 'PROGRESS':
                    document.getElementById('progress-fill').style.width = data.percent + '%';
                    document.getElementById('progress-text').textContent = data.percent.toFixed(1) + '%';
                    break;
                case 'RESULTS':
                    console.log(data.result);
                    console.log('time:', data.time, 'ms');

                    const win = document.getElementById('win-value');
                    const tie = document.getElementById('tie-value');

                    win.innerHTML = `${Math.round(data.result.win * 1000) / 10}%`;
                    tie.innerHTML = `${Math.round(data.result.tie * 1000) / 10}%`;
                    break;
            }
        }

        document.getElementById('cancel-btn').addEventListener('click', this.cancel);
    }

    start(data, simulations) {
        const batches = get_batches(simulations);
        const batch_size = Math.ceil(simulations / batches);

        console.log('data:', data);
        console.log('simulations:', simulations);
        console.log('batches:', batches);
        console.log('batch_size:', batch_size);

        this.worker.postMessage({
            type: 'START',
            data: {
                data: data,
                simulations: simulations,
                batches: batches,
                batch_size: batch_size
            }
        });
    }

    cancel() {
        this.worker.postMessage({
            type: 'CANCEL'
        });
    }
}