import { Chart, registerables } from 'chart.js';

// Register all Chart.js components that we need
Chart.register(...registerables);

export default Chart; 