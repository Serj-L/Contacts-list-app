import {
  Header,
  Footer,
  Container,
} from './components';
import { RouterView } from './Router';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />

      <Container>
        <RouterView />
      </Container>

      <Footer />
    </div>
  );
}

export default App;
