import { useEffect, useState } from 'react'
import CreateSessionPage from './admin/BasicPages/sessionPage/CreateSessionPage'
import LeftNavBar from './admin/navigationbar/LeftNavBar'
import NavBar from './admin/navigationbar/NavBar'
import './App.css'
import CustomInput from './component/CustomInput'
import Example from './component/Example'
import CustomDropDown from './component/CustomDropDown'



function App() {
  
  const [info , setInfo] = useState({});
  const [valid,setValid] = useState({});

  const options = [
    { label: "Select School", value: "" },
    { label: "School A", value: "school_a" },
    { label: "School B", value: "school_b" }
  ];


  const changeInfo=(name,value) =>{
    // console.log(e.target.id);
    // console.log(e.target.value);
    setInfo({...info , [name] : value})
  }


  const checkValidity = () => {
    let errors = {};
    if (!info["school"]) {
      errors["school"] = "School is required.";
    }
    setValid(errors);
  };

  useEffect(()=>{
    checkValidity();
    console.log(info);
  },[info])


  // return (
  //   <div className="gap-2">
  //     <CustomDropDown
  //       name="school"
  //       options={options}
  //       handleChange={changeInfo}
  //       valid={valid}
  //       required={true}
  //     />
  //   </div>
  // );

  return(
    <div className='gap-2'>
      {/* <Example /> */}
      <CustomInput name = {'Name of Student'} type={'text'} handleChange = {changeInfo} valid={valid} />
      <CustomInput name = {'Mobile Number'} type={'number'} handleChange = {changeInfo} valid={valid} disabled = {true}/>
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
