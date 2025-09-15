import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from "./components/layout";
import { TextDiff } from "./pages";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

function App() {
  useDynamicFavicon();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TextDiff />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
