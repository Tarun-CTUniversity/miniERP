import React, { useEffect, useState } from 'react'
import CustomForm from './CustomForm';
import axios from 'axios';
import { HOST } from '../constants/Constants';
import CustomDropDown from './Inputs/CustomDropDown';

export default function AcademicInfoSelector({required = [true,true,true,true,true] , setMetaData}) {
  const [fetchedSessionData , setFetchedSessionData] = useState({});
  const [optionArray , setOptionArray] = useState({
    session:[],
    school:[],
    department:[],
    program:[],
    specialization:[]
  });
  const [selectedObject , setSelectedObject] = useState({
    session:{},
    school:{},
    department:{},
    program:{},
    specialization:{}
  });
  const [error , setError] = useState({
    session:"",
    school:"",
    department:"",
    program:"",
    specialization:""
  });
  const [disabled , setDisabled] = useState({
    session: false,
    school: true,
    department: true,
    program:true,
    specialization:true
  })

  const handlePrintData = () => {
    console.log("Print data:", {
      fetchedSessionData,
      optionArray,
      selectedObject,
      error,
      disabled
    });
  };

  

  useEffect(() => {
    fetchSessionData();
  }, []);

  useEffect(() => {
    const newDisabled = {};
    Object.entries(optionArray).forEach(([key, arr]) => {
        newDisabled[key] = arr.length === 0;
    });
    setDisabled(newDisabled);
   }, [optionArray]);


  const fetchSessionData = async () => {
    try {
      const resp = await axios.get(`${HOST}/api/v1/basicInfo/session/getSessionsData`);
      const resp_data = resp.data.data;
      setFetchedSessionData(resp_data);
      setOptionArray((prev) => ({
        ...prev,
        session: resp_data.filter((val) => val.deleted == false).map((val) => val.name)
      }))
    } catch (err) {
      alert("Server Not working Properly");
      console.error(err);
    }
  };

  

  const handleInputData = (level, val) => {
    if (optionArray[level].includes(val)) {
      let selectedItem;
  
      // Find selected item based on level
      if (level === 'session') {
        selectedItem = fetchedSessionData.find((s) => s.name === val);
      } else if (level === 'school') {
        selectedItem = selectedObject.session.schools.find((s) => s.name === val);
      } else if (level === 'department') {
        selectedItem = selectedObject.school.departments.find((d) => d.name === val);
      } else if (level === 'program') {
        selectedItem = selectedObject.department.programs.find((p) => p.name === val);
      } else if (level === 'specialization') {
        selectedItem = selectedObject.program.specializations.find((sp) => sp.name === val);
      }
  
      // Update selectedObject
      const updatedSelectedObject = {
        ...selectedObject,
        [level]: selectedItem,
      };
      setSelectedObject(updatedSelectedObject);
  
      // Define the mapping to next level array names
      const nextLevelMap = {
        session: 'schools',
        school: 'departments',
        department: 'programs',
        program: 'specializations',
      };
  
      const nextLevel = nextLevelMap[level];
      let nextOptions = [];
  
      if (nextLevel && selectedItem?.[nextLevel]) {
        nextOptions = selectedItem[nextLevel]
          .filter((item) => item.deleted === false)
          .map((item) => item.name);
      }
  
      if (nextLevel) {
        setOptionArray((prev) => ({
          ...prev,
          [nextLevel.slice(0, -1)]: nextOptions,
        }));
      }
  
      // Clear error for this level
      setError((prev) => ({
        ...prev,
        [level]: "",
      }));
  
      // ✅ Check if this is the last required dropdown
      const levelIndex = names.indexOf(level);
      const lastRequiredIndex = required.lastIndexOf(true);
      if (levelIndex === lastRequiredIndex) {
        setMetaData(updatedSelectedObject);  // Call with the latest selected values
      }
    } else {
      // Set error for invalid value
      setError((prev) => ({
        ...prev,
        [level]: `Please provide a valid ${level} name`,
      }));
    }
  };
  

  const names = ["session" , "school" , "department" ,"program" , "specialization"];

  return (
    <div className='flex p-10'>
        {
            names?.map((name,index)=>{
               return required?.[index] == true &&
                <CustomDropDown
                key={name} 
                name = {name}
                options = {optionArray[name]}
                handleChange = {handleInputData}
                valid = {error}
                placeholder = "Select..."
                required = {required[index]}
                disabled = {disabled[name]}
                />
            })
        }
    </div>
  )
}
