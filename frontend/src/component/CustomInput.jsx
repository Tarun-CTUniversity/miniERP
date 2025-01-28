import React from 'react'

export default function CustomInput({name , type , setInfo}) {
    const handleChange = (e)=>{
        setInfo((prev)=>{
            return {...prev , [name]:e.target.value};
        })
    }
  return (
    <div className='flex flex-col border-2 border-blue-500 border-solid m-5'>
        <div>
            {name}
        </div>
        <input type={type} onChange={handleChange} className=' border-2 border-solid border-black'/>
    </div>
  )
}
