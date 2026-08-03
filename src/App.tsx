import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'
import ScrollToTopButton from './components/layout/ScrollToTopButton'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/proyectos"           element={<Projects />} />
          <Route path="/proyectos/:slug"     element={<ProjectDetail />} />
          <Route path="/nosotros"            element={<About />} />
          <Route path="/contacto"            element={<Contact />} />
          <Route path="*"                    element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTopButton />
    </>
  )
}
