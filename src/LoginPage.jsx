import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import mainSlice, { addError, login, setLoading } from './mainSlice'
import { Formik, Form, Field } from 'formik';
import {useNavigate} from "react-router-dom"
import * as Yup from 'yup';
import { loginUser } from './firebase-functions';
import Profile from './Profile';
export default function LoginPage() {
  let dispatch = useDispatch(mainSlice)
  let state = useSelector(state=>state.mainSlice)
  let goTo = useNavigate()
  // console.log(state.error)
  // useEffect(()=>{
  //   dispatch(addError(""))
  // },[])
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, "Password should be atleast 6 letter long").required('Password is required'),
});
  return (
    <div className='login-page' >
     <Formik
    initialValues={{
        email: '',
        password: '',
    }}
    validationSchema={LoginSchema}
    onSubmit={
      values=>{
        dispatch(setLoading(true))
        loginUser(values.email,values.password).then(res=>{
          dispatch(login(res))
          dispatch(setLoading(false))
          goTo("/profile")
        }).catch(err=>{
          console.log(err)
        })
        
      }
            }
            >
    {({ errors, touched }) => (
        <Form>
            <div>Enter Email</div>
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <div>Enter Password</div>
            <Field name="password" type="password" />
            {errors.password && touched.password ? (
                <div>{errors.password}</div>
                ) : null}
            <button type='submit' >Login</button>
        </Form>
    )}
</Formik>

    {/* <button onClick={()=>{
      dispatch(login())
    }} >Login</button> */}

    <p>Not registered Yet? <button onClick={()=>goTo("/sign-up")}>
            Click to sign up            
            </button></p>
            <h1>Error {JSON.stringify(state.error)}</h1>
    </div>

  )
}
