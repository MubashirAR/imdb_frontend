import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import axios from 'axios'
import { BrowserRouter as Router, Link, Route, useHistory } from 'react-router-dom';
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import PrivateRoute from './pages/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewMovie from './pages/NewMovie';
import { AuthContext } from './context/auth';
import { useEffect, useState } from 'react';

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens") || '{}');
  const existingIsAdmin = localStorage.getItem("isAdmin");
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [isAdmin, setIsAdmin] = useState(existingIsAdmin);
  let history = useHistory()
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }
  function logOut() {
    localStorage.setItem("tokens", '');
    localStorage.setItem("isAdmin", '');
    setAuthTokens();
  }
  const isAdminProxy = isUserAdmin => {
    localStorage.setItem("isAdmin", isUserAdmin)
    setIsAdmin(isUserAdmin)
  }
  return (
    <div className="App">
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, setIsAdmin: isAdminProxy, isAdmin }}>
        <Router basename={'static'}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link to="/" className="navbar-brand">
                Fynd's IMDB
              </Link>
              <ul className="navbar-nav">
                <Link to="/" className="navbar-brand">
                  <li className="nav-item active">
                    Home
                  </li>
                </Link>
                
                {authTokens && authTokens.access_token
                ? (
                    <>
                    {
                      isAdmin

                      ? (
                        <>
                          <Link to="/admin" className="navbar-brand">
                              <li className="nav-item">
                                Admin
                              </li>
                            </Link>
                            <Link to="/newMovie" className="navbar-brand">
                            <li className="nav-item">
                              New Movie
                            </li>
                          </Link>
                        </>
                      )
                      : null
                    }
                      <li className="nav-item" onClick={logOut}>
                          Logout
                      </li>
                    </>
                ) : (
                  <Link to="/login" className="navbar-brand">
                    <li className="nav-item">
                      Login
                    </li>
                  </Link>
                )}
              </ul>
          </nav>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/admin" component={Admin} />
            <PrivateRoute path="/newMovie" component={NewMovie} />
          </div>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
