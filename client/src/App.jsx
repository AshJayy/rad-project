import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import FreeTrial from './pages/FreeTrial'
import Exam from './pages/Exam'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Subscribe from './pages/Subscribe'
import Header from './components/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
        <Routes>
        <Route path="Home" element={<Home />} />
        <Route path="FreeTrial" element={<FreeTrial />} />
        <Route path="Exam" element={<Exam />} />
        <Route path="SignIn" element={<SignIn />} />
        <Route path="SignUp" element={<SignUp />} />
        <Route path="Subscribe" element={<Subscribe />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
