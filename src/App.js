import React from 'react';

import Skeleton from '@mui/material/Skeleton'; 
import Typography from '@mui/material/Typography'; 
import Stack from '@mui/material/Stack'; 
import { LinearProgress, Link } from '@mui/material';

import {
  Polyline,
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  Circle,
  Tooltip,
} from 'react-leaflet';
import { useState } from 'react';
import { useMapEvent } from 'react-leaflet/hooks'
import { defineSys, create, generateText } from './connector'

import atlataStations from './json/marta_stations_geo.json';
import amsterdamStations from './json/metro_stations_geo.json';
import rotterdamStations from './json/rotterdam_stations_geo.json';
  
import S3JsonAutocomplete from './components/S3JsonAutocomplete';
import ImageUploader from './components/ImageUploader';
import ChatterBox from './components/ChatterBox';
import FavoritesLink from './components/FavoritesLink';
import DeleteListingComponent from './components/ListingDelete';
import PropertyList, { PropertyGrid } from './components/PropertyList';
import './style.css'

const redMarkerIcon = color => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
 


const MapMarkers = ({ items, onChange, onUpdate }) => {

  const colorOf = (prop) => {
    let color;
    if (prop.selected) {
      color = 'green';
    } else {
      color = prop.favorite ? 'red' : 'grey'
    }
    return color;
  }



  return (
    <>
      {  items.map((station) => (
          <Marker
            key={station.name}
            icon={redMarkerIcon(colorOf(station))}
            position={[
              station.lat,
              station.lon,
            ]}
          >
            <Popup open>
              <ImageUploader object={station} onChange={onUpdate}  onClick={() => !!station.address && onChange(station)}  /> 
            <Typography sx={{ cursor: 'pointer' }} variant="subtitle2" onClick={() => onChange(station)}
            > {station.favorite ? '❤️' : ''}  {station.address}</Typography>
            <Typography   variant="caption"  > {station.rentalDetails.rentPrice}</Typography>
           <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Link target="_blank" href={station.url}>Open Listing</Link> 
            <FavoritesLink jsonData={station} onChange={onUpdate} />
            <DeleteListingComponent filename={station.fileName} onChange={onUpdate}  />
           </Stack>
            </Popup>
          </Marker>
        )) }
    </>
  );
};

const MapLine = ({ color, lineData }) => {
  const polyline = Object.keys(lineData).map((key) => [
    lineData[key].lat,
    lineData[key].long,
  ]); 
  return (
    <>
      {Object.keys(lineData).map((key) => (
        <Circle
          center={[lineData[key].lat, lineData[key].long]}
          pathOptions={{ fillColor: color, color }}
          radius={50}
        >
          <Tooltip>click me!</Tooltip>
        </Circle>
      ))}

      <Polyline pathOptions={{ color }} positions={polyline} />
    </>
  );
};

const MapLines = ({ mapLineData }) => { 
  return (
    <>
      {Object.keys(mapLineData).map((line) => (
        <MapLine color={line} lineData={mapLineData[line]} />
      ))}
    </>
  );
};

function MyComponent({ onZoom }) {
  const map = useMapEvent('zoom', () => {
    onZoom (map.getZoom())
  })
  return null
}

export default function App() {
  const ref = React.useRef()
  const [selectedProperty, setSelectedProperty] = useState({})
  const [refresh, setRefresh] = useState(null)
  const [jsonList, setJsonList] = useState([]);
  const [city, setCity] = useState('Rotterdam');
  const [center, setCenter] = useState([]);
  const [busy, setBusy] = useState(false);
  const [querying, setQuerying] = useState(false);
  const [zoom, setZoom] = useState(15);
  const [chatQuestion, setChatQuestion] = useState()
  const [chatMem, setChatMem] = useState([])
  const [progress, setProgress] = useState(0)
 
  const [chosenProps, setChosenProps] = React.useState([])

  React.useEffect(() => {
    const bunch =  jsonList.filter(f => f.city === city)
      .map(item => ({
        name: item.title,
        ...item,
        selected: Number(item.lat) === Number(center[0]),
      })); 
    setChosenProps(bunch)
  }, [jsonList, center])

 
  const metroMaps = {
    'Atlanta': atlataStations,
    'Amsterdam': amsterdamStations,
    'Rotterdam': rotterdamStations
  }

  const setProp = prop => {
    const { city, lat, lon }  = prop;
    setSelectedProperty(prop)
    setCenter([])
    setBusy(true)
 
    setTimeout(() => {
      setCenter([ lat, lon]);
      setCity(city)
      setBusy(false)
      setChatMem( [])
      setChatQuestion("")
    }, 999)

  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the form from submitting and refreshing the page 
    const { image, ...rest } = selectedProperty; 
    const chat = create(chatQuestion)
    const query = [defineSys(rest), ...chatMem, chat];
    setChatQuestion("") 
    setChatMem(c => [...c, chat]) ;
    setQuerying(true)
    const res = await generateText(query, 512); 
    const answer = res.choices[0].message;  
    setQuerying(false)
    setChatMem(c => [...c, answer])  
  };

  const chatProps = {
    chatMem, setChatMem, chatQuestion, setChatQuestion, selectedProperty, handleSubmit ,
    setRefresh, querying
  }
  

  return (
   <>
     {!!progress && <LinearProgress variant="determinate" value={progress}/>}

    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', 
      height: '60px',
      position: 'fixed',
      zIndex: 1000,
      width: 'calc(100% - 32px)'
    }}> 
      <div style={{ flexGrow: 1 }} /> 
  
      <S3JsonAutocomplete onChange={value => { 
        setProp(value)
      }} jsonList={jsonList} 
      selected={selectedProperty}
      setProgress={setProgress}
      setJsonList={setJsonList} refresh={refresh} setRefresh={setRefresh}  />
    </div>

   {!!busy && <Skeleton variant="rectangular"   style={{ width: '100%', height: '100%' }}/>}

    <PropertyGrid visible={!center.length && !busy} 
      onUpdate={() => setRefresh(new Date().toString())}
      properties={jsonList} itemClicked={setProp}
      />
 

   {!!center.length && !busy && <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapLines mapLineData={metroMaps[city]} />

      <MapMarkers onChange={value => setProp(value)} items={chosenProps} onUpdate={() => setRefresh(new Date().toString())} />

      <MyComponent onZoom={setZoom} />
    </MapContainer>}

    <ChatterBox {...chatProps} />
 

   </>
  );
}
 
