import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Result } from "antd";

const NotPermitted = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;

    const handleRedirectLogin = async () => {
        navigate('/login')
        //handle logout
        //dispatch(doLogoutAction());
    }

    return (
        <>
            {userRole === 'ADMIN' &&
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, The page you visited does not exist."
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>Back Home</Button>
                    }
                />
            }
            {userRole === 'USER' &&
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, The page you visited does not exist."
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>Back Home</Button>
                    }
                />
            }
        </>
    )
}

export default NotPermitted;