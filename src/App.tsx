import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from "./components/layout";
import { TextDiff } from "./pages";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";
import { ComingSoon } from './components/ui';

function App() {
  useDynamicFavicon();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TextDiff />} />
          <Route path="/image" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
