import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {

    const user = useSelector(state => state.account.user);

    return (
        <div>
            <Outlet />
        </div>
    )
}

export default LayoutAdmin;