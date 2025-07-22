import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <>
      <main
        className='container'
        style={{ paddingBottom: 60 }}
      >
        <Outlet />
      </main>
      <footer className='footer'>copyright finaldestination@2025</footer>
    </>
  )
}

export default LandingPage
