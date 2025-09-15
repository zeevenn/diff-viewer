import { Layout } from "./components/layout";
import { DiffEditor } from "./components/DiffEditor";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

function App() {
  useDynamicFavicon();

  return (
    <Layout>
      <DiffEditor />
    </Layout>
  );
}

export default App;
