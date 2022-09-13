import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from "react-router-dom"
import { delTrip, getTrips } from './firebase-functions'
import mainSlice, { addTrips, displayTrip, setCurrPlaces, setLoading } from './mainSlice'
export default function Profile() {
  let state = useSelector(state=>state.mainSlice)
  let dispatch = useDispatch(mainSlice)
  let goTo = useNavigate()
  useEffect(()=>{
    dispatch(setCurrPlaces("del"))
      if(state.user===null){
        goTo("/login")
      }
      else{
        //getTrips will be firebase fubction
        getTrips(state.user.id).then((res)=> dispatch(addTrips(res))).catch(err=>console.log(err))
      }
  },[])
  return (
    <div className='profile' >
       <h1>Hi, {state.user.profile.userName}</h1>
       <h2>You are signed in as : {state.user.profile.email}</h2> 
       <hr />
      <button className='plan-btn' onClick={()=>goTo("/add-trip")} >Plan new trip</button>
    <div className="trips-list">
       {state.trips.map((ele,i)=>{
           return <div className="trip-card">
              <div className="header">
              <img src="" alt="" />
              <h2>{ele.title}</h2>
              <div className="card-buttons">
                <button onClick={()=>{
                  dispatch(displayTrip(state.trips[i]))
                  dispatch(setCurrPlaces("edit"))
                  goTo(`/edit-trip/${i}`)}} >Edit Trip</button>
                <button onClick={()=>{
                  dispatch(setLoading(true))
                  delTrip(ele.id).then(()=>{setLoading(false)
                  goTo("/profile")
                  })
                }}>Remove Trip</button>
              </div>
              </div>
              <div className="card-main">
               {ele.places?ele.places.split("-").map(ele=>{
                return <div className="loc">
                  <h2>{ele.split("&&")[0]}</h2>
                  <img src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${ele.split("&&")[1]},${ele.split("&&")[2]},8.57,0/100x100?access_token=pk.eyJ1IjoiYXJuYXZwdXJpIiwiYSI6ImNrZHNhb3ppYTBkNDYyeHFza3diMXZtdnkifQ.fCuBiUZ9JjgUbBlaBDvPrw`} alt="" srcset="" />
                </div>
               }):null}
              {/* Location of trip in map */}
              <img src="" alt="" />
              </div>
              <div className='card-footer' >
                <div>
                <h3 className='label' >Leaving on</h3>
                <h3>{ele.date}</h3>
                </div>
                <div>
                <h3 className='label' >Trip Duration</h3>
                <h3>{ele.days}</h3>
                </div>
                <div>
                <h3 className='label' >Persons</h3>
                <h3>{ele.persons}</h3>
                </div>
              </div>
            </div>
       })}
    </div>
    </div>
  )
}
