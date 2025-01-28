import React from 'react'

export default function CustomInput({name , type , handleChange}) {
  return (
    <div className='flex flex-col border-2 border-blue-500 border-solid m-5'>
        <div>
            {name}
        </div>
        <input id={name} type={type} onChange={handleChange} className=' border-2 border-solid border-black'/>
    </div>
  )
}
