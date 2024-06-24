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
import { useDispatch, useSelector } from 'react-redux';
import { getUserByToken } from './services/user.js';
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

  // const dispatch = useDispatch();

  // const getAccount = async () => {
  //   const res = await getUserByToken();
  //   console.log(">>> check res getUserByToken <App.js>: ", res);
  //   if (res && res.result) {
  //     dispatch(doGetAccountAction(res.result))
  //   }
  // }

  // useEffect(() => {
  //   getAccount();
  // }, [])

  const router = createBrowserRouter([

    //================User====================
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,
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



    //================Login====================
    {
      path: "/login",
      element: <Login />,
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
