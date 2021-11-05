import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { setupStore } from './store';

try {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={setupStore()}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
} catch (ex) {
  console.error(ex);
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
