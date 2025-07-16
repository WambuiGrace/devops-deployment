import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import MainLayout from './layouts/MainLayout.jsx'
import Blog from './pages/Blog.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import SavedPostsPage from './pages/SavedPostsPage.jsx'
import SinglePost from './pages/SinglePost.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import UserProtectedRoute from './components/UserProtectedRoute.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import UserList from './components/admin/UserList.jsx';
import PostList from './components/admin/PostList.jsx';
import CategoryList from './components/admin/CategoryList.jsx';
import CreatePost from './components/admin/CreatePost.jsx';
import UserEditPage from './pages/UserEditPage.jsx';
import PostEditPage from './pages/PostEditPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/blog',
        element: <Blog />,
      },
      {
        path: '/blog/:id',
        element: <SinglePost />,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '',
        element: <UserProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/saved-posts',
            element: <SavedPostsPage />,
          },
        ],
      },
      {
        path: '',
        element: <AdminProtectedRoute />,
        children: [
          {
            path: '/admin/dashboard',
            element: <AdminDashboardPage />,
            children: [
              {
                path: 'users',
                element: <UserList />,
              },
              {
                path: 'posts',
                element: <PostList />,
              },
              {
                path: 'categories',
                element: <CategoryList />,
              },
              {
                path: 'create-post',
                element: <CreatePost />,
              },
            ],
          },
          {
            path: '/admin/user/:id/edit',
            element: <UserEditPage />,
          },
          {
            path: '/admin/post/:id/edit',
            element: <PostEditPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>,
)
