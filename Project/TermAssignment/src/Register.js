import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './css/Register.css'
import './css/Login.css'
//import UserPool from './UserPool';


const Register = () => {

const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').matches(/^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, 'Invalid email address'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async(values) => {
    console.log('Form data', values);
    /*
    const user = UserPool.signUp(
        values.email,
        values.password,
        [],
        null
    );
    */
   fetch('https://8nj236yhkd.execute-api.us-east-1.amazonaws.com/prod/createuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      if(data.statusCode === 200 && data.body === 'Account Created'){
        alert('Account Created');
      navigate('/Login');}
        else if(data.statusCode === 200 && data.body === 'email exists')
        alert('Account already exists');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error creating account')
        }
    );
    //console.log(user);
    //navigate('/Login');

  };

  const loginButton = () => {
    console.log('Register button clicked');
    navigate('/Login');
  };



  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className='login-h1'>Register</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <div className="form-group">
              <label htmlFor="email" className='login-input'>Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="password" className='login-input'>Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
            <button type="submit" className="signup-button">
            Register
          </button>
          <br/>
          <div className='signup-form-row'>
          <button type="button" className="login-button" onClick={loginButton}>
            Have an account? Login
          </button>
          </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
