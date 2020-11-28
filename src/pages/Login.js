import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/auth";

function Login() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory()
  const { setAuthTokens, setIsAdmin, authTokens } = useAuth();

  useEffect(async () => {
    const { token_type, access_token } = authTokens || {};
    let user = await axios.get('/users/me',{
      headers: {
          'Authorization': ` ${token_type} ${access_token}`
      }
    });
    if(user.data.role === 'admin') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
    history.push('/admin')
  }, [isLoggedIn])
  var bodyFormData = new FormData();
  async function postLogin() {
    bodyFormData.append('username', userName);
    bodyFormData.append('password', password);
    try {
      let result = await axios.post("/token", bodyFormData, {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      })
      console.log({result})
      if (result.status === 200) {
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
        setIsError(true);
      }
      
      // history.push('/')
    } catch (error) {
      setIsError(true);
    }
  }
  return (
    <div className="card">
      {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
      <div className="card-body">
            <div className="form-group">
                <input
                    type="username"
                    value={userName}
                    onChange={e => {
                        setUserName(e.target.value);
                    }}
                    placeholder="email"
                />

            </div>
            <input
            type="password"
            value={password}
            onChange={e => {
                setPassword(e.target.value);
            }}
            placeholder="password"
            />
            <button onClick={postLogin}>Sign In</button>
            <div>
            <Link to="/signup">Don't have an account?</Link>
                { isError && 'The username or password provided were incorrect!' }

            </div>

      </div>
    </div>
  );
}

export default Login;