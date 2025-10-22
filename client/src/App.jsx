import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import LiveEditor from './pages/LiveEditor'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'
import AnimatedBackground from './components/AnimatedBackground'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = useCallback(async () => {
    const token = localStorage.getItem('token')
    try {
      if(token){
        const { data } = await api.get('/api/users/data', {headers: {Authorization: token}})
        if(data.user){
          dispatch(login({token, user: data.user}))
        }
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }, [dispatch])

  useEffect(()=>{
    getUserData()
  },[getUserData])

  return (
    <>
    <AnimatedBackground />
    <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/live-editor' element={<LiveEditor />}/>

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
        </Route>

        <Route path='view/:resumeId' element={<Preview />}/>

      </Routes>
    </>
  )
}

export default App
