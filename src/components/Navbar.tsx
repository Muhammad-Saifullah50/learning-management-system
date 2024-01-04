import React from 'react'
import MobileSidebar from './MobileSidebar'
import NavbarRoutes from './NavbarRoutes'

const Navbar = () => {
  return (
    <nav className='p-4 border-b flex items-center bg-white h-full shadow-sm'>
      <MobileSidebar/>
      <NavbarRoutes/>
    </nav>
  )
}

export default Navbar
