import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  withScriptjs
} from "react-google-maps";


const Markers = props => {
  return (
    <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center} 
    //Управление контролем карты, зум, перемещение, прогулка по улицам и прочее
    defaultOptions={{
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      rotateControl: false,
      fullscreenControl: false,
    //   scrollwheel: false,
    //   draggable: false
    }}>
      {props.places.map(place => {
        return (
          <Marker
          //Иконка маркера
            key={place.id}
            //Позиция маркера
            position={{ lat: place.lat, lng: place.lng }}>
          </Marker>
        );
      })}
    </GoogleMap>
  );
};

export default withScriptjs(withGoogleMap(Markers));