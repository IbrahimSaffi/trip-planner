import React from 'react'
import mainSlice, { addError, login, setLoading } from './mainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createUser } from './firebase-functions';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
const SignupSchema = Yup.object().shape({

  firstName: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, "Password should be atleast 6 letter long").required('Password is required'),
  passwordCheck: Yup.string().test("password-match", "Passwords must match", function (value) {
    return this.parent.password === value
  }).required('Re-enter Password'),
  dateOfBirth: Yup.date()
    .required('Required')
  ,
  country: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  city: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),

});
export default function SignupPage() {
  let dispatch = useDispatch(mainSlice)
  let state = useSelector(state => state.mainSlice)
  // useEffect(()=>{
  //   // dispatch(addError(""))
  // },[])

  let goTo = useNavigate()
  return (
    <div className='signup-page' >
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordCheck: '',
          dateOfBirth: '',
          country: '',
          city: '',

        }}
        validationSchema={SignupSchema}
        onSubmit={
          values => {
            dispatch(setLoading(true))
            let email = values.email
            let password = values.password
            // let name = values.firstName+values.lastName
            createUser(email, password).then(() => {
              dispatch(setLoading(false))
              goTo("/login")
            }).catch(e => {
              console.log(e)
              // dispatch(addError(e))
            })
          }
        }
      >
        {({ errors, touched }) => (
          <Form>
            <div>Enter First Name</div>
            <Field name="firstName" />
            {errors.firstName && touched.firstName ? (
              <div>{errors.firstName}</div>
            ) : null}
            <div>Enter Last Name</div>
            <Field name="lastName" />
            {errors.lastName && touched.lastName ? (
              <div>{errors.lastName}</div>
            ) : null}
            <div>Enter Email</div>
            <Field name="email" type="email" />
            {errors.email && touched.email ? <div>{errors.email}</div> : null}
            <div>Enter Password</div>
            <Field name="password" type="password" />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            <div>Re-enter Password</div>
            <Field name="passwordCheck" type="password" />
            {errors.passwordCheck && touched.passwordCheck ? (
              <div>{errors.passwordCheck}</div>
            ) : null}
            <div>Enter Date of Birth</div>
            <Field name="dateOfBirth" type="date" />
            {errors.dateOfBirth && touched.dateOfBirth ? <div>{errors.dateOfBirth}</div> : null}
            <div>Enter Country</div>
            <Field name="country" />
            {errors.country && touched.country ? (
              <div>{errors.country}</div>
            ) : null}
            <div>Enter City</div>
            <Field name="city" />
            {errors.city && touched.city ? (
              <div>{errors.city}</div>
            ) : null}
            <button type='submit' >Signup</button>
          </Form>
        )}
      </Formik>

      <p>Already have account? <button onClick={() => goTo("/login")}>
        Click to Login
      </button></p>
      <h1>Error {JSON.stringify(state.error)}</h1>
    </div>
  )
}
