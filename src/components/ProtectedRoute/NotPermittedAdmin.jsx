import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Result } from "antd";
import Loading from '../Loading';

const NotPermitted = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const handleRedirectLogin = async () => {
        navigate('/login')
    }

    return (
        <>
            {(userRole === 'ADMIN' || userRole === 'USER') &&
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, The page you visited does not exist."
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>Back Home</Button>
                    }
                />
            }
          
            {!isAuthenticated &&
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, The page you visited does not exist."
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>Back Login</Button>
                    }
                />
            }
        </>
    )
}

export default NotPermitted;