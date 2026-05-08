import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import ResultPage from './pages/Result/ResultPage.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Layout>
  );
}
