import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {

   const {user} = useSelector(state => state.auth)
   const dispatch = useDispatch()

    const navigate = useNavigate()

    const logoutUser = ()=>{
        navigate('/')
        dispatch(logout())
    }

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all' role="navigation" aria-label="Main navigation">
        <div className='flex items-center gap-6'>
          <Link to='/' className="flex items-center gap-3" aria-label="Home — Resume Builder">
            <img src="/logo.svg" alt="Maaz Ansari logo" className="h-11 w-auto" />
            <div className="text-sm">
              <div className="font-semibold">Maaz Ansari</div>
              <div className="text-xs text-slate-500">Resume Builder</div>
            </div>
          </Link>

          <div className='hidden md:flex items-center gap-4 text-sm' role="menubar">
            <Link role="menuitem" to='/' className='text-slate-700 hover:text-slate-900 transition'>Home</Link>
            <Link role="menuitem" to='/app' className='text-slate-700 hover:text-slate-900 transition'>Dashboard</Link>
            <Link role="menuitem" to='/about' className='text-slate-700 hover:text-slate-900 transition'>About</Link>
          </div>
        </div>

        <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden text-slate-600'>Hi, <span className='font-medium text-slate-800'>{user?.name ?? 'Guest'}</span></p>
            <button onClick={logoutUser} aria-label="Logout" className='btn-accent rounded-full px-4 py-1.5 active:scale-95 transition-all focus:outline-none focus-visible:shadow-lg'>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
