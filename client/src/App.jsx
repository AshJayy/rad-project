import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import FreeTrial from './pages/FreeTrial'
import Exam from './pages/Exam'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Subscribe from './pages/Subscribe'
import Header from './components/Header'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="freetrial" element={<FreeTrial />} />
        <Route path="exam" element={<Exam />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="subscribe" element={<Subscribe />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
