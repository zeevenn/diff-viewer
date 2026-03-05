import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'

import { NotFound } from './components/common'
import { Layout } from './components/layout'
import { useTheme } from './context/theme-provider'
import { useDynamicFavicon } from './hooks/use-dynamic-favicon'
import { ImageDiff, TextDiff } from './pages'

function App() {
  useDynamicFavicon()
  const { resolvedTheme } = useTheme()

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="top-center" richColors theme={resolvedTheme} />
        <Routes>
          <Route path="/" element={<TextDiff />} />
          <Route path="/image" element={<ImageDiff />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
