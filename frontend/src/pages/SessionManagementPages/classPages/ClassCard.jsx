import React, { useEffect, useState } from "react";
import CancelButton from "../../../component/Buttons/CancelButton";
import UpdateButton from "../../../component/Buttons/UpdateButton";
import axios from "axios";
import { HOST } from "../../../constants/Constants";
import { v4 as uuidv4 } from 'uuid';
import SubDataRenderer from "../componenet/SubDataRenderer";
import AcademicInfoSelector from "../../../component/AcademicInfoSelector";

const CardData = {
  columns : 4,
  names : ["name" , "code" , "des"],
  tags : ["CustomInput",  "CustomInput" , "textarea"],
  types : ["text","text","text"],
  placeholders:["Enter School Name" , "Abbreviation" , "Enter Description"],
  required : [true,true,false],
  options : [],
  dependencies : [null,"name",null],
  styles:[null,null,null],
  rowStarts:[1,1,2],
  rowSpans:[1,1,1],
  colStarts : [1,2,1],
  colSpans : [1,1,4],
  useFunction: [
    { fun: "uppercase", for: "name", input: ["name"] },
    { fun: "abbreviation", for: "code", input: ["name"] },
    { fun: "uppercase", for: "code", input: ["code"] }
  ],
  deletionAllowed : true,
};

function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

const ClassCard = () => {
  const [selectedObject , setSelectedObject] = useState({
    session:{},
    school:{},
    department:{},
    program:{},
    specialization:{}
  });

  const [existingSubData,setExistingSubData] = useState([]);
  const [addSubData , setAddSubData] = useState([]);


  const [valid, setValid] = useState({
    existingSubData : [],
    addSubData : []
  });

  const handlePrintData = () => {
    console.log("Print data:", {
      selectedObject,
      existingSubData,
      addSubData,
      valid
    });
  };
  

  // ✅ Matches CreateSession naming
  const addNewSubData = () => {
    const newDept = { name: "", code: "", des: "",id: uuidv4() };
    setAddSubData((prev) => [...prev, newDept]);
    setValid((prev) => ({
      ...prev,
      addSubData: [...prev.addSubData, { name: "", code: "" }],
    }));
  };

  const handleDeleteSubData= (mode,index) => {
    if(mode == 'add'){
      setAddSubData((prev) => prev.filter((_, i) => i !== index));
      setValid((prev) => ({
        ...prev,
        addSubData: prev.addSubData.filter((_, i) => i !== index),
      }));
    }else{
      const updatedSubData = [...existingSubData];
      updatedSubData[index].deleted = !updatedSubData[index].deleted; // Toggle the deleted statu
      setExistingSubData(updatedSubData);
    }
  }

  const handleUpdateSubData = (mode , index , newData) => {
    if(mode == 'add'){
      const updatedSubData = [...addSubData];
      updatedSubData[index] = newData;
      setAddSubData(updatedSubData);
     }
    else{
      const updatedSubData = [...existingSubData];
      updatedSubData[index] = newData; 
      setExistingSubData(updatedSubData);
    }
  }

  const validatesubDatas = () => {
    // Validate all department data before submission
    const seenNames = new Set();
    const seenCodes = new Set();
    let error = false;
  
    const validatesubData = (subDatas, subDataType) => {
      const newValidsubDatas = [];
  
      subDatas.forEach((subData, index) => {
        const normalizedName = subData.name.trim().toLowerCase();
        const normalizedCode = subData.code.trim().toLowerCase();
        const validData = valid[subDataType][index];
  
        // Validate names
        if (normalizedName === "") {
          validData.name = "Empty Name";
          error = true;
        } else {
          if (seenNames.has(normalizedName)) {
            validData.name = "Duplicate Name";
            error = true;
          } else {
            validData.name = "";
            seenNames.add(normalizedName);
          }
        }
  
        // Validate codes
        if (normalizedCode === "") {
          validData.code = "Empty Code";
          error = true;
        } else {
          if (seenCodes.has(normalizedCode)) {
            validData.code = "Duplicate Code";
            error = true;
          } else {
            validData.code = "";
            seenCodes.add(normalizedCode);
          }
        }
  
        newValidsubDatas.push(validData);
      });
  
      setValid((prev) => ({ ...prev, [subDataType]: newValidsubDatas }));
      return error;
    };
  
    // Validate both new and existing departments
    const newDeptError = validatesubData(addSubData, "addSubData");
    const existingDeptError = validatesubData(existingSubData, "existingSubData");
  
    return newDeptError && existingDeptError;
  };

  const handleUpdateData = async () => {
    const hasError = validatesubDatas();
    if (hasError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const data = {
      Session,
      School,
      existingSubData: existingSubData,
      addSubData: addSubData
    };

    try {
      const response = await axios.put(`${HOST}/api/v1/basicInfo/school/updateSchoolDepartments`, data);
      if (response.status === 200) {
        alert("Data Updated Successfully");
        if(response.data.data){
          const fetched = response.data.data;
          
          setExistingSubData(fetched.map((dept) => ({ name : dept.name, code : dept.code, id : dept._id  , deleted : dept.deleted , des:dept.description })));
          setAddSubData([]);
          setValid((prev) => ({
            ...prev,addSubData: [],
            existingSubData: fetched.map(() => ({ name: "", code: "" })),  
    
        }));
      }
      } else {
        alert("Failed to update data. Please try again.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again.");
    }
  }

 

  return (
    <div className="bg-gray-50 flex flex-col">
        <header className="p-6 bg-blue-500 text-white text-center text-2xl font-bold" onClick={handlePrintData}>
          Add School Info
        </header>

        <AcademicInfoSelector required = {[true,true,true,true]}  setMetaData={setSelectedObject} />
        
        
        {/* Add New Data */}
        <div className="flex flex-col border border-gray-300 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={addNewSubData}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              + Add Department
            </button>
          </div>

          <SubDataRenderer 
            items = {addSubData}
            formSchema = {CardData}
            options = {[null,null,null]}
            validationArray = {valid.addSubData}
            onDelete = {handleDeleteSubData}
            onUpdate = { handleUpdateSubData}
            mode = {'add'}
            style = {
              {
                marginTop: '30px'
              }
            }
          
          />

        </div>

        {/* ///////////............. Active Departments Section ...........////// */}
        {existingSubData.length > 0 && 
        <div className="flex flex-col border border-gray-300 rounded-lg mt-10 p-4 relative">
          <div className="text-lg font-semibold ml-10">Active Departments</div> 
          
          <SubDataRenderer 
              items = {existingSubData.filter((val)=>val.deleted == false)}
              formSchema = {CardData}
              options = {[null,null,null]}
              validationArray = {valid.existingSubData}
              onDelete = {handleDeleteSubData}
              onUpdate = { handleUpdateSubData}
              mode = {'active'}          
            />
          
        </div>}

        {/* ///////////............. Deleted Departments Section ...........////// */}
        {existingSubData.length > 0 &&
        <div className="flex flex-col border border-gray-300 rounded-lg p-4 mt-10 relative">
          <div className="text-lg font-semibold ml-10">Deleted Departments</div>
          <SubDataRenderer 
              items = {existingSubData.filter((val)=>val.deleted != false)}
              formSchema = {CardData}
              options = {[null,null,null]}
              validationArray = {valid.existingSubData}
              onDelete = {handleDeleteSubData}
              onUpdate = { handleUpdateSubData}
              mode = {'deleted'}         
            />
        </div>}

         {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <CancelButton handleClick={() => console.log("Cancel")} />
          <UpdateButton handleClick={handleUpdateData} /> 
        </div>
      
    </div>
  );
};

export default ClassCard;
