import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Result } from "antd";
import Loading from '../Loading';

const NotPermittedAdmin = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const handleRedirectLogin = async () => {
        navigate('/login')
    }

    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, The page you visited does not exist."
                extra={
                    <Button type="primary" onClick={handleRedirectLogin}>Back Login</Button>
                }
            />
        </>
    )
}

export default NotPermittedAdmin;