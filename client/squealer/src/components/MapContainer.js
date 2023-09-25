import {useEffect, useMemo, useRef, useState} from 'react';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { google } from 'google-maps';
import Spinner from "./Spinner";

export default function MapContainer({position, editable , mark, onPick}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDN2Sr99IyZH4rm4fCWvVrx2Md-G2HImPA",
    });

    if(!isLoaded) {
        return <Spinner/>
    } else {
        return <Map pos={position} edit={editable} mark={mark} onPick={(e) => {onPick(e)}}/>;
    }
}

function Map({pos, edit, mark, onPick}) {
    const [position, setPosition] = useState(null);

    let lat;
    let lng;
    if(pos){
        lat = pos.lat;
        lng = pos.lng;
    } else if(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    } else {
        lat = 44.4949;
        lng = 11.3426;
    }
    let center = useMemo(() => ({lat: lat, lng: lng}), [position]);
    let marker;

    useEffect(() => {
        async function retrievePosition() {
            setPosition(await getPosition());
        }
        retrievePosition();
    }, []);

    return(
        <div className='map-wrapper'>
            {position ?
                    <GoogleMap zoom={15} center={center} onClick={edit ? onPick : null} mapContainerClassName="map-container">
                        {mark ? mark.map((marker) => (
                            <MarkerF
                                key={0}
                                position={{
                                    lat: marker.lat,
                                    lng: marker.lng
                                }}/>
                        )): null}
                    </GoogleMap>
                    :
                    <Spinner />
            }
        </div>
    )
}

function getPosition() {
    return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
    });
}