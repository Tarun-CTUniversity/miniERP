import { useEffect, useState } from 'react'
import CreateSessionPage from './admin/BasicPages/sessionPage/CreateSessionPage'
import LeftNavBar from './admin/navigationbar/LeftNavBar'
import './App.css'
import CreateSession from './pages/SessionManagementPages/SessionPages/CreateSession'
import AdminManageSession from "./SessionManagement/AdminManageSession"
import AddSchoolInfo from './pages/SessionManagementPages/SchoolPages/AddSchoolInfo'



function App() {
  const [userType, setUserType] = useState("Student");
  const handleSubmit = () =>{
    console.log("data")
  }

  // return AdminManageSession()

  return(
      <AddSchoolInfo/>
      // <CreateSession />
  )
  
  const [info , setInfo] = useState({});
  const [valid,setValid] = useState({});

  const options = ["Apple", "Banana", "Cherry", "Mango"];


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
    if (!info["schoolName"]) {
      errors["schoolName"] = "School is required.";
    }
    setValid(errors);
  };

  useEffect(()=>{
    checkValidity();
    console.log(info);
    console.log(valid);
  },[info])

  return(
    <div className='gap-2'>
      {/* <Example /> */}
      <CustomInput name = {'Name of Student'} type={'text'} handleChange = {changeInfo} valid={valid} />
      <CustomInput name = {'Mobile Number'} type={'number'} handleChange = {changeInfo} valid={valid} disabled = {true}/>
      <CustomDropDown
        name="schoolName"
        options={options}
        handleChange={changeInfo}
        valid={valid}
        required={true}
      />

      <CustomAutoComplete name="school"
        options={options}
        handleChange={changeInfo}
        valid={valid}
        required={true} />

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
