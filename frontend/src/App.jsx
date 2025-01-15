import CreateSessionPage from './admin/BasicPages/sessionPage/CreateSessionPage'
import LeftNavBar from './admin/navigationbar/LeftNavBar'
import NavBar from './admin/navigationbar/NavBar'
import './App.css'


function App() {
  

  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
      {/* Top */}
      {/* <NavBar /> */}
      {/* Bottom */}
      <div className='bg-slate-600 w-full flex-grow flex'>
        {/* Left */}
        <LeftNavBar />
        {/* Main Body */}
        <div className='bg-white h-full w-full'>
          <CreateSessionPage />
        </div>
      </div>
    </div>
  )
}

export default App
