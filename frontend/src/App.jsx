import { useEffect, useState } from 'react'
import CreateSessionPage from './admin/BasicPages/sessionPage/CreateSessionPage'
import LeftNavBar from './admin/navigationbar/LeftNavBar'
import NavBar from './admin/navigationbar/NavBar'
import './App.css'
import CustomInput from './component/CustomInput'



function App() {
  
  const [info , setInfo] = useState({});

  const changeInfo=(e) =>{
    // console.log(e.target.id);
    // console.log(e.target.value);
    setInfo({...info , [e.target.id] : e.target.value})
  }

  useEffect(()=>{
    console.log(info);
  },[info])

  return(
    <div className='gap-2'>
      <CustomInput name = {'Name of Student'} type={'text'} handleChange = {changeInfo}/>
      <CustomInput name = {'Mobile Number'} type={'number'} handleChange = {changeInfo}/>
    </div>
  )

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
