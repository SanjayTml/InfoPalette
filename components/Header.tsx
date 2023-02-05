import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto'>
        <div className='flex items-center space-x-5'>
            <Link href="/">
                <h1 className='border-b-2 border-black border-l-2 p-2 font-bold'>
                    InfoPalette
                </h1>
            </Link>
            
            <div className='hidden md:inline-flex items-center space-x-5'>
                <h3>Tech</h3>
                <h3>Literature</h3>
                <h3>About</h3>
                <h3 className='text-white bg-sky-600 px-4 py-1'>Newsletter</h3>
            </div>
        </div>

        <div className='flex items-center space-x-5 text-sky-600'>
            <a href='https://infopalette.sanity.studio/'><h3>Sign In</h3></a>
            {/* <h3 className='border px-4 py-1 border-sky-600'>Create Account</h3> */}
        </div>

    </header>
  )
}

export default Header