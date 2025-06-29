import React from 'react'
import Login from './pages/Login'
import Singup from './pages/Singup'

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Friends from './pages/Friends'
import Layout from './pages/Layout'
import PostPage from './pages/PostPage'
import AboutPage from './pages/AboutPage'
import FriendsPage from './pages/FriendsPage'
import PhotosPage from './pages/PhotosPage'

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <><ProtectedRoute><Home /></ProtectedRoute></>
  // },
  {
    path: '/profile/:id',
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
    children: [
      {
        path:'post',
        element: <PostPage/>
      },
      {
        path:'about',
        element: <AboutPage/>
      },
      {
        path:'friends',
        element: <FriendsPage/>
      },
      {
        path:'photos',
        element: <PhotosPage/>
      },
    ]
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'friends',
        element: <Friends />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Singup />
  }
])

const App = () => {
  return (
    <div >
      <RouterProvider router={router} />
    </div>
  )
}

export default App
