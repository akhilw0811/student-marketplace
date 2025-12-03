import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sell from './pages/Sell';
import MyListings from './pages/MyListings';
import Messages from './pages/Messages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="sell" element={<Sell />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
