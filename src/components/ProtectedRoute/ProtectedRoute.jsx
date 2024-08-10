import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import NotPermitted from './NotPermitted';

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;

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