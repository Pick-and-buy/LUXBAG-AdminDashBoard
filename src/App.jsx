import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Login from './pages/login/index.jsx';
import ContactPage from './pages/contact/index.jsx';
import BookPage from './pages/book/index.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home/index.jsx';
import Loading from './components/Loading/index.jsx';
import NotFound from './components/NotFound/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getUserByToken, callFetchAccount } from './services/user.js';
import { doGetAccountAction } from './redux/account/accountSlice.js';

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

  const dispatch = useDispatch();

  const getAccount = async () => {

    if (window.location.pathname === '/login') return;

    const res = await callFetchAccount();
    console.log(">>> check res callFetchAccount <App.js>: ", res);
    if (res && res.result) {
      dispatch(doGetAccountAction(res.result))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([

    //================User====================
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },
    //================Admin====================
    {
      path: "/admin",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },


    //================Login====================
    {
      path: "/login",
      element: <Login />,
    },

  ]);

  return (
    <>
      {isLoading === false || window.location.pathname === '/login'
      ?
      <RouterProvider router={router} />
      :
      <Loading />
      }
    </>
  )
}
