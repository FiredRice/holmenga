import FiredRice from './core';
import middlewares from './middlewares';
import App from './App';
import config from './service/config';

await config.init();

const app = new FiredRice();

app.use(middlewares);

app.injectRouters(<App />);

app.start(document.getElementById('root'));