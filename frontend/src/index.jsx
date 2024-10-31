import ReactDOM from 'react-dom/client';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './services/index.js';

const root = ReactDOM.createRoot(document.getElementById('chat'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);