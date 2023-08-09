import React from 'react';

import Skeleton from '@mui/material/Skeleton';  
import { LinearProgress } from '@mui/material';

import {
  Polyline,
  MapContainer,
  TileLayer, 
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
import ChatterBox from './components/ChatterBox'; 
import { PropertyGrid } from './components/PropertyList';
import './style.css'
import { MapMarkers, ListingImages } from './components/MarkerPopup';
 

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

function MyComponent({ onZoom, onClick }) {
  const map = useMapEvent('zoom', () => {
    onZoom (map.getZoom())
  })
  const click = useMapEvent('click', onClick)
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
  const [carouselOn, setCarouselOn] = useState(true)
 
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
      setCarouselOn(true)
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
    speakText(answer.content);
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

      <ListingImages on={carouselOn} onChange={value => setProp(value)} listings={chosenProps} selectedListing={selectedProperty}  />

      <MyComponent onZoom={setZoom} onClick={() => setCarouselOn(!carouselOn)} />
    </MapContainer>}

    <ChatterBox {...chatProps} />
 

   </>
  );
}
 
function speakText(speechText) {
  // Check if speech synthesis is supported in the browser
  if ('speechSynthesis' in window) {
    // Create a new SpeechSynthesisUtterance object
    var utterance = new SpeechSynthesisUtterance(speechText);
    
    // Use the default speech synthesis voice
    utterance.voice = speechSynthesis.getVoices()[0];
    // Set the language to US English (en-US)
    utterance.lang = 'en-US';
    
    // Start speaking the text
    speechSynthesis.speak(utterance);
  } else {
    console.error('Speech synthesis is not supported in this browser.');
  }
}
 
