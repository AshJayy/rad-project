import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function _404(){
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className="text-mid-blue mt-[-65px] text-9xl font-extrabold">
        Oops!
      </div>
      <div className="text-mid-blue mt-6 text-xl font-semibold">
        404 - page not found
      </div>
      <div className="text-dark-blue mt-6 text-md text-center font-regular">
        The page you are looking for might have been removed
        had its nam changed or is temporarily unavailable.
      </div>
      <Button className="bg-mid-blue mt-6" pill>
        <Link to="/">
          GO TO HOMEPAGE
        </Link>
      </Button>
    </div>
  )
}
