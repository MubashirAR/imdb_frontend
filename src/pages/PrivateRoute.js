import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens, isAdmin } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        authTokens && authTokens.access_token && isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default PrivateRoute;