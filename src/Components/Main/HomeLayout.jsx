import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function HomeLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, marginLeft: 220, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}