import { BrowserRouter, Route, Routes } from 'react-router'

import { Layout } from './components/layout'
import { ComingSoon, NotFound } from './components/ui'
import { useDynamicFavicon } from './hooks/useDynamicFavicon'
import { TextDiff } from './pages'

function App() {
  useDynamicFavicon()

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TextDiff />} />
          <Route path="/image" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
