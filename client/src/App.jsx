import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import CreateQuestion from './pages/CreateQuestion'
import PrivateRouteOnlyAdmin from './components/PrivateRouteOnlyAdmin'
import UpdateQuestion from './pages/UpdateQuestion'
import QuestionPage from './pages/questionPage'

function App() {
  const location = useLocation();

  // Pages where Header and Footer should not be displayed
  const noHeaderFooterRoutes = ['/signin', '/signup'];

  return (
    <>
      {/* Conditionally render Header and Footer */}
      {!noHeaderFooterRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signin" element={<SignIn />} /> 
        <Route path="signup" element={<SignUp />} />
        <Route path="freetrial" element={<FreeTrial />} />
        <Route path="exam" element={<Exam />} />
        <Route path="subscribe" element={<Subscribe />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRouteOnlyAdmin />}>
          <Route path='/createQuestion' element={<CreateQuestion />} />
          <Route path='/editQuestion/:questionID' element={<UpdateQuestion />} />
          <Route path='/question/:questionID' element={<QuestionPage />} />
        </Route>
      </Routes>
      {!noHeaderFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  )
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
