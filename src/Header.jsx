import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mainSlice, { logout } from './mainSlice'
import {useNavigate} from "react-router-dom"
export default function Header() {
  let goTo = useNavigate()
  let dispatch = useDispatch(mainSlice)
  let state = useSelector(state=>state.mainSlice)
  return (
    
    <div className='header'>
      <h1>Travel Planner</h1>
      {state.user!==null? <button onClick={()=>{
        goTo("/login")
        dispatch(logout())
      }} >Logout</button>:null}
     
    </div>
  )
}
