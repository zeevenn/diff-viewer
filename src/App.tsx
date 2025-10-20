import { BrowserRouter, Route, Routes } from 'react-router'

import { Toaster } from 'sonner'
import { Layout } from './components/layout'
import { NotFound } from './components/ui'
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { useTheme } from './hooks/useTheme'
import { ImageDiff, TextDiff } from './pages'

function App() {
  useDynamicFavicon()
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="top-center" richColors theme={theme} />
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
