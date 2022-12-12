import React from "react";
import {useAuth} from './auth-context/auth.context';
import {Outlet, useNavigate} from 'react-router-dom';

export const ProtectedRoute = () => {
    const navigate = useNavigate();
    let {user} = useAuth();
    return (<>
        {(!user || !user.token || user.token === "") ? (
            // <SweetAlert
            //   title="You must be signed in!"
            //   onCancel={() => navigate("/authentication/sign-in")}
            //   onConfirm={() => navigate("/authentication/sign-in")}
            //   confirmBtnCssClass={"px-5"}
            // />
            <Outlet/>
        ) : (
            <Outlet/>
        )}
    </>);
};
