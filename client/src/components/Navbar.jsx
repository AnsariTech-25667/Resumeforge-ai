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
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <div className='flex items-center gap-6'>
          <Link to='/' className="flex items-center gap-3" aria-label="Home — Resume Builder">
            <img src="/logo.svg" alt="Maaz Ansari logo" className="h-11 w-auto" />
            <div className="text-sm">
              <div className="font-semibold">Maaz Ansari</div>
              <div className="text-xs text-slate-500">Resume Builder</div>
            </div>
          </Link>

          <div className='hidden md:flex items-center gap-4 text-sm'>
            <Link to='/' className='text-slate-700 hover:text-slate-900 transition'>Home</Link>
            <Link to='/app' className='text-slate-700 hover:text-slate-900 transition'>Dashboard</Link>
            <Link to='/live-editor' className='text-slate-700 hover:text-slate-900 transition'>Live Editor</Link>
            <Link to='/developer-credibility' className='text-slate-700 hover:text-slate-900 transition'>Tech Profile</Link>
            <Link to='/template-showcase' className='text-slate-700 hover:text-slate-900 transition'>3D Templates</Link>
            <Link to='/ai-dashboard' className='text-slate-700 hover:text-slate-900 transition'>AI Dashboard</Link>
          </div>
        </div>

        <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden'>Hi, {user?.name ?? 'Guest'}</p>
            <button onClick={logoutUser} aria-label="Logout" className='bg-white hover:bg-slate-50 border border-gray-300 px-4 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
