import React from 'react'

const UserDashboard = () => {
  return (
    <div className='w-screen flex flex-col items-center gap-8'>
        <h1 className='font-bold text-3xl'>What's on your mind today?</h1>
        <input type='text' placeholder='Type something' className='w-1/2 border-1 border-white rounded-xl py-4 px-2'></input>
    </div>
  )
}

export default UserDashboard