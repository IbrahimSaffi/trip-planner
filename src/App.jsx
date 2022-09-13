
import './App.css';
import {Routes,Route,useNavigate} from "react-router-dom"
import FirstPage from './FirstPage';
import { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { useDispatch,useSelector } from 'react-redux'
import mainSlice, { setCurrPlaces } from './mainSlice';
import Header from './Header';
import AddTrip from './AddTrip';
import Profile from './Profile';
import Loading from './Loading';

function App() {
  let state = useSelector(state=>state.mainSlice)
  let goTo = useNavigate()
  useEffect(()=>{
    if(state.loading){
      goTo("/loading")
    }
  },[state.loading])
  return (
    <div>
    <Header/>
    <Routes>
      <Route path='/' element={<FirstPage/>}>
       <Route path='login' element={<LoginPage/>} />
       <Route path='sign-up' element={<SignupPage/>} />
      <Route/>
      </Route>
      <Route path='add-trip' element={<AddTrip/>}/>
      <Route path='profile' element={<Profile/>}/>
      <Route path='edit-trip/:id' element={<AddTrip/>}/>
      <Route path='loading' element={<Loading/>}/>
    </Routes>
    </div>
  )
}

export default App;
