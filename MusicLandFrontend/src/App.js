import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter } from 'react-router-dom';
import './style/main.css'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import PageRoute from './routes/PageRoute.jsx';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <body>
      <Provider store={store}>
      <Header />
      <PageRoute/>
      <Footer />
      </Provider>
      </body>
    </div>
    </BrowserRouter>


  );
}

export default App;
