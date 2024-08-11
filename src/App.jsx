import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Login from './pages/login/index.jsx';
import PostPage from './pages/post/index.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home/index.jsx';
import Loading from './components/Loading/index.jsx';
import NotFound from './components/NotFound/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUserByToken, callFetchAccount } from './services/user.js';
import { doGetAccountAction } from './redux/account/accountSlice.js';
import BrandTable from './components/Admin/Brand/BrandTable.jsx';
import BrandLinesTable from './components/Admin/BrandLines/BrandLinesTable';
import CategoryTable from './components/Admin/Category/CategoryTable.jsx';
import LayoutAdmin from './components/Admin/LayoutAdmin.jsx';
import './styles/reset.scss';
import AdminDashboard from './pages/admin/index.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import UserTable from './components/Admin/User/UserTable';
import NewsTable from './components/Admin/News/NewsTable';
import PostTable from './components/Admin/Post/PostTable.jsx';
import TransactionPage from './components/Admin/Transaction/TransactionPage.jsx';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {

  const isLoading = useSelector(state => state.account.isLoading);
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);
  const dispatch = useDispatch();

  const getAccount = async () => {
    if (window.location.pathname === '/login') return;

    const res = await callFetchAccount();
    if (res && res.result) {
      dispatch(doGetAccountAction(res.result))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     getAccount();
  //   }
  // }, [isAuthenticated]);

  const router = createBrowserRouter([

    //================User====================
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "post/:slug",
          element: <PostPage />,
        },
      ],
    },
    //================Admin====================
    {
      path: "/admin",
      element:
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element: <AdminDashboard />
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "brands",
          element: <BrandTable />,
        },
        {
          path: "brandLines",
          element: <BrandLinesTable />,
        },
        {
          path: "category",
          element: <CategoryTable />,
        },
        {
          path: "news",
          element: <NewsTable />,
        },
        {
          path: "posts",
          element: <PostTable />,
        },
        {
          path: "transactions",
          element: <TransactionPage />,
        },
      ],
    },

    //================Login====================
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      {/* {isLoading === false
        || window.location.pathname === '/login' || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      } */}
      <RouterProvider router={router} />
    </>
  )
}
