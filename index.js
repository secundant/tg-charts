import { RootView } from './views';
import input from './models/input.json';

new RootView(input[4]).renderTo(document.getElementById('root'));
