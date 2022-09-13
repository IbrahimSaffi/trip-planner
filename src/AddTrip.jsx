import React, { useRef } from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import mainSlice, { addTrips, delPlace, displayTrip, setAutocomplete, setCurrPlaces, setLoading } from './mainSlice';
import { addTrip, getTrips, updateTrip } from './firebase-functions';

const tripScheme = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too Short!')
    .required('Required'),
  date: Yup.date().min(new Date('9-13-2022')).required('Required'),
  days: Yup.number().min(1).required('Select atleast one day'),
  persons: Yup.number().min(1).required('Select atleast one person'),
});
export default function AddTrip() {
  let goTo = useNavigate()
  let state = useSelector(state => state.mainSlice)
  let dispatch = useDispatch(mainSlice)
  let id = useParams().id
  let places = useRef()
  useEffect(() => {
    // dispatch(setCurrPlaces("del"))
    dispatch(setAutocomplete([]))
    if (state.user === null) {
      goTo("/login")
    }
    if (id) {
      dispatch(displayTrip(state.trips[id]))
      dispatch(setCurrPlaces("edit"))
      console.log(state.placesAdded)
    }
  }, [])
  async function getPlaceFromApi(q) {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?access_token=pk.eyJ1IjoiYXJuYXZwdXJpIiwiYSI6ImNrZHNhb3ppYTBkNDYyeHFza3diMXZtdnkifQ.fCuBiUZ9JjgUbBlaBDvPrw&autocomplete=true`
    let res = await fetch(url)
    let data = await res.json()
    let autocomplete = []
    data.features.forEach(ele => {
      autocomplete.push([ele.place_name, ele.geometry.coordinates[0], ele.geometry.coordinates[1]])
    })
    dispatch(setAutocomplete(autocomplete))
  }
  return (
    <div className='addtrips-page'>
      {state.placesAdded.map((ele,i) => {
        return <p>{ele.split("&&")[0]} <button onClick={()=>dispatch(delPlace(i))} >X</button></p>
      })}
      <div></div>
      <Formik
        initialValues={{
          title: id ? `${state.trip.title}` : "",
          date: id ? `${state.trip.date}` : new Date().now,
          days: id ? Number(`${state.trip.days}`) : "",
          persons: id ? Number(`${state.trip.persons}`) : ""

        }}
        validationSchema={tripScheme}
        onSubmit={
          values => {
            values.places = state.placesAdded.join("-")
            dispatch(setLoading(true))
            if (!id) {
              addTrip(state.user.id, values).then(() => {
                goTo("/profile")
                getTrips(state.user.id).then((res) => {
                  dispatch(addTrips(res))
                  dispatch(setLoading(false))
                }).catch(err => console.log(err))
              }).catch(err => console.log(err))

            }
            else {
              updateTrip(state.trip.id, values).then(() => {
                goTo("/profile")
                getTrips(state.user.id).then((res) => {
                  dispatch(addTrips(res))
                  dispatch(setLoading(false))
                }).catch(err => console.log(err))
              }).catch(err => console.log(err))
            }
          }
        }
      >
        {({ errors, touched }) => (
          <Form>
            <div>Add title for you trip</div>
            <Field placeholder={"Name of trip"} name="title" type="title" />
            {errors.title && touched.title ? <div>{errors.title}</div> : null}
            <div>Selet places you want to visit</div>
            <input placeholder="Jhelum, Pakistan" ref={places} name="places" type="places" onChange={() => {
              dispatch(setAutocomplete([]))
            }} onKeyDown={(e) => {
              if (e.key === "Enter") {
                getPlaceFromApi(places.current.value)
              }

            }} />
            {state.autocomplete.length > 0 ? <div className="suggestions">
              {state.autocomplete.map((ele, i) => {
                return <div>
                  <p>{ele[0]}</p>
                  <button onClick={() => {
                    dispatch(setCurrPlaces(state.autocomplete[i]))
                  }} >Select</button>
                </div>
              })}
            </div> : null}
            <div>When does trip start</div>
            <Field name="date" type="date" />
            {errors.date && touched.date ? (
              <div>{errors.date}</div>
            ) : null}
            <div>For how many days?</div>
            <Field name="days" type="days" placeholder={1}/>
            {errors.days && touched.days ? (
              <div>{errors.days}</div>
            ) : null}
            <div>How many people will be travelling?</div>
            <Field name="persons" type="persons" placeholder={1} />
            {errors.persons && touched.persons ? (
              <div>{errors.persons}</div>
            ) : null}
            <button type='submit' >Done</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
