import React, { useEffect, Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import LiveEditor from './pages/LiveEditor'
import AIProcessingDashboard from './pages/AIProcessingDashboard'
import DeveloperCredibilityDashboard from './pages/DeveloperCredibilityDashboard'
import Template3DShowcase from './pages/Template3DShowcase'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'
import AnimatedBackground from './components/AnimatedBackground'
import ProgressiveWebApp from './components/ProgressiveWebApp'
import EnterpriseUXSystem from './components/EnterpriseUXSystem'
import SmartFormAutoComplete from './components/SmartFormAutoComplete'
import ContextualHelpSystem from './components/ContextualHelpSystem'
import KeyboardShortcutsSystem from './components/KeyboardShortcutsSystem'
import AccessibilitySystem from './components/AccessibilitySystem'
import { RouteTransition } from './components/PageTransition'
import { ErrorBoundary, PerformanceMonitor, initializeMonitoring } from './utils/monitoring'

// Performance optimized lazy-loaded components
import PerformanceOptimizer from './components/PerformanceOptimizer'
const MagneticButton = lazy(() => import('./components/MagneticButton'))
const ParallaxSection = lazy(() => import('./components/ParallaxSection'))
const InteractiveBackground = lazy(() => import('./components/InteractiveBackground'))
const ContextualTooltip = lazy(() => import('./components/ContextualTooltip'))
const InteractiveOnboarding = lazy(() => import('./components/InteractiveOnboarding'))
const GitHubProjectShowcase = lazy(() => import('./components/GitHubProjectShowcase'))
const PersonalBranding = lazy(() => import('./components/PersonalBranding'))
const ContactForm = lazy(() => import('./components/ContactForm'))

// Development-only components
const IntegrationTestDashboard = process.env.NODE_ENV === 'development' 
  ? lazy(() => import('./components/IntegrationTestDashboard'))
  : null
const ProductionDashboard = process.env.NODE_ENV === 'development'
  ? lazy(() => import('./components/ProductionDashboard'))
  : null

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
    initializeMonitoring()
  },[getUserData])

  return (
    <ErrorBoundary>
      <AnimatedBackground />
      <Toaster />
      <PerformanceMonitor />
      
      {/* Enterprise UX Systems */}
      <ProgressiveWebApp />
      <EnterpriseUXSystem />
      <ContextualHelpSystem />
      <KeyboardShortcutsSystem />
      <AccessibilitySystem />
      
      <RouteTransition>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/live-editor' element={<LiveEditor />}/>
          <Route path='/ai-dashboard' element={<AIProcessingDashboard />}/>
          <Route path='/developer-credibility' element={<DeveloperCredibilityDashboard />}/>
          <Route path='/template-showcase' element={<Template3DShowcase />}/>

          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />}/>
            <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
          </Route>

          <Route path='view/:resumeId' element={<Preview />}/>

        </Routes>
      </RouteTransition>
    </ErrorBoundary>
  )
}

export default App
