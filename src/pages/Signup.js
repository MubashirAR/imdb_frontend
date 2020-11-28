import React, { useState } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";
import CONSTANTS from "../constants";

const initialState = {
  username: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
}
function Signup() {
  const [user, setUser] = useState(initialState)
  const history = useHistory()
  const changeHandler = (key, index) => e => {
    const { value } = e.target || { value: e };
    console.log({[key]: value})
    setUser({
      ...user,
      [key]: value
    })
  }
  // The api should also have validation because the form can be modified from inspect element
  const isEmailValid = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const isPasswordValid = password => {
    let regx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regx.test(password)
  }
  const isFormValid = () => {
    const { username, email, role, password, confirmPassword } = user;
    console.log({ password, confirmPassword})
    return !!username && !!email && !!role && (password === confirmPassword)
  }
  const saveUser = async () => {
    if(!isEmailValid(user.email)) {
      alert('Please enter a valid email')
      return;
    }
    if(!isPasswordValid(user.password)) {
      alert('Password must be minimum eight characters with at least one letter and one number')
      return;
    }
    if(!isFormValid()) {
      alert('Please fill in all details. Also ensure password matches with confirm password')
      return;
    }
    user.genre = user.genres;
    try {
      const resp = await axios.post(CONSTANTS.path + '/users/', user);
      if(resp.status === 201) {
        alert('Saved successfully')
        history.push('/')
      } else {
        alert('There was an error')
      }
    } catch (error) {
      alert('There was an error.')
    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center w-100 p-5">
      <div className="card">
        <div className="card-body">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text">Username</label>
          </div>
          <input className="form-control" onChange={changeHandler('username')} value={user.username}/>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text">Email</label>
          </div>
          <div>
            <input type="email" className="form-control" onChange={changeHandler('email')} value={user.email}/>
          </div>
          {
            user.email && !isEmailValid(user.email)
            ? <div>Please enter a valid email ID</div>
            : ''
          }
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text">Password</label>
          </div>
          <input type="password" className="form-control" onChange={changeHandler('password')} value={user.password}/>
          
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text">Confirm Password</label>
          </div>
          <input type="password" className="form-control" onChange={changeHandler('confirmPassword')} value={user.confirmPassword}/>
          {
            user.password !== user.confirmPassword
            ? <p>Passwords do not match!</p>
            : ''
          }
        </div>
        <div className="input-group" onClick={_ => changeHandler('role')('admin')}>
          <div className="input-group-prepend">
            <div className="input-group-text">
              <input type="radio" checked={user.role === 'admin'}/>
            </div>
          </div>
          <input disabled type="text" className="form-control" value="Admin"/>
        </div>
        <div className="input-group" onClick={_ => changeHandler('role')('user')}>
          <div className="input-group-prepend">
            <div className="input-group-text">
              <input type="radio" checked={user.role === 'user'}/>
            </div>
          </div>
          <input disabled type="text" className="form-control" value="User"/>
        </div>
      </div>

      {
        user.password && !isPasswordValid(user.password)
        ? <p>Password must be minimum eight characters with at least one letter and one number</p>
        : ''
      }
      <button disabled={!isFormValid() || !isPasswordValid(user.password) || !isEmailValid(user.email)} className="btn btn-primary pull-right" onClick={_ => saveUser()}>Save</button>
    </div>
  </div>
  );
}

export default Signup;