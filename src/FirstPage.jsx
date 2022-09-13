import React from 'react'
import LoginPage from './LoginPage'
import mainSlice, { login, signup } from './mainSlice'
import SignupPage from './SignupPage'
import {Outlet,useNavigate} from "react-router-dom"
import { useDispatch,useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function FirstPage() {
  let goTo = useNavigate()
  useEffect(()=>{
      goTo("/login")
  },[])
  let dispatch = useDispatch(mainSlice)
  return (
    <div>
            <Outlet/>
    </div>
  )
}
