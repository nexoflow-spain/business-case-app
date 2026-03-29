import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BusinessCaseList from './pages/BusinessCaseList';
import BusinessCaseDetail from './pages/BusinessCaseDetail';
import Assistant from './pages/Assistant';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cases" element={<BusinessCaseList />} />
          <Route path="/cases/:id" element={<BusinessCaseDetail />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
