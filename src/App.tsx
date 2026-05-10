import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { QuizView } from './pages/QuizView';
import { AnalysisView } from './pages/AnalysisView';
import { Resources } from './pages/Resources';
import { Flashcards } from './pages/Flashcards';
import { Analytics } from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<QuizView />} />
          <Route path="analysis" element={<AnalysisView />} />
          <Route path="resources" element={<Resources />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
