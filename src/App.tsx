import { Layout } from "./components/layout";
import { DiffEditor } from "./components/DiffEditor";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

function App() {
  useDynamicFavicon();

  return (
    <>
      <Layout>
        <p className="text-gray-600 dark:text-gray-200 text-center mb-8">
          Compare files and visualize differences in real-time
        </p>

        <DiffEditor />
      </Layout>
    </>
  );
}

export default App;
