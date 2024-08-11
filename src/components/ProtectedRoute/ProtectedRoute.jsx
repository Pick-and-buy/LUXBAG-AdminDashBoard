import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import NotPermitted from './NotPermitted';
import Loading from '../Loading';
import { doGetAccountAction } from '../../redux/account/accountSlice';
import { callFetchAccount } from '../../services/user';

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;

    const isLoading = useSelector(state => state.account.isLoading);

    if (isAdminRoute && userRole === 'ADMIN') {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;

    const isLoading = useSelector(state => state.account.isLoading);
    const dispatch = useDispatch();

    if(isLoading && userRole === "") {
        return (<NotPermitted />)
    } 
    else if(isLoading) {
        return <Loading />;
    }

    // if (isLoading) {
    //     return <Loading />;
    // }

    return (
        <>
            {isAuthenticated === true ?
                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                :
                <Navigate to='/login' replace />
            }
        </>
    )
}

export default ProtectedRoute;