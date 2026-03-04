import { BrowserRouter, Route, Routes } from 'react-router'

import { Toaster } from 'sonner'
import { ComingSoon, NotFound } from './components/common'
import { Layout } from './components/layout'
import { useDynamicFavicon } from './hooks/use-dynamic-favicon'
import { useTheme } from './hooks/use-theme'
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
