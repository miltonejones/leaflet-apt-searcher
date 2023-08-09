import React from 'react';
import { Marker, Popup } from 'react-leaflet'; // Make sure to import necessary components
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ImageUploader from './ImageUploader';  
import FavoritesLink from './FavoritesLink';  
import DeleteListingComponent from './ListingDelete';
import { Collapse } from '@mui/material';
import '../style.css';


const redMarkerIcon = color => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
 

const MarkerPopup = ({ station, onChange, onUpdate }) => {
  const [on, setOn] = React.useState(false)
  const colorOf = (prop) => {
    let color;
    if (prop.selected) {
      color = 'green';
    } else {
      color = prop.favorite ? 'red' : 'grey';
    }
    return color;
  };

  
  const rooms = station.bedroomCount + '/' + station.bathroomCount
  const size = station.size + '' + station.sizeType;

  return (
    <Marker
      key={station.name}
      icon={redMarkerIcon(colorOf(station))}
      position={[station.lat, station.lon]}
    >
      <Popup>
        <ImageUploader object={station} onChange={onUpdate} onClick={() => !!station.address && onChange(station)} />
        <Typography sx={{ cursor: 'pointer' }} variant="subtitle2" onClick={() => onChange(station)}>
          {station.favorite ? '❤️' : ''} {station.address} [{rooms} - {size}]
        </Typography>
        <Typography sx={{ cursor: 'pointer', color: t => t.palette.primary.main,
        '&:hover': {
          textDecoration: 'underline'
        } }}  onClick={() => setOn(!on)} variant="caption">{station.rentalDetails.rentPrice} <b>{on?"less":"more"}...</b> </Typography>
        <Collapse in={on}>{station.description}</Collapse>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Link target="_blank" href={station.url}>
            Open Listing
          </Link>
          <FavoritesLink jsonData={station} onChange={onUpdate} />
          <DeleteListingComponent filename={station.fileName} onChange={onUpdate} />
        </Stack>
      </Popup>
    </Marker>
  );
};

export const MapMarkers = ({ items, onChange, onUpdate }) => {
  return (
    <>
    {items.map((station, e) => (
      <MarkerPopup key={station.name + e} station={station} onChange={onChange} onUpdate={onUpdate} />
    ))}
  </>
  );
};
 

export const ListingImages = ({ on, listings, onChange, selectedListing }) => {
  const initialIndex = listings.map(f => f.address).indexOf(selectedListing.address);
  const [index, setIndex] = React.useState(initialIndex);
  const [startX, setStartX] = React.useState(0);

  const left = (index + 1) * 100;
  const halfViewportSize = (window.innerWidth / 2) - left;

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  }

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;

    if (startX > endX + 30) { // swiped left
      setIndex(prev => (prev < listings.length - 1) ? prev + 1 : prev);
    } else if (startX + 30 < endX) { // swiped right
      setIndex(prev => (prev > 0) ? prev - 1 : prev);
    }
  }

  return (
    <div
      style={{ left: halfViewportSize, bottom: on ? 0 : -300 }}
      className="listing-images"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="images-container">
        {listings.map((listing, e) => (
          <img 
            key={listing.address}
            onClick={() => onChange(listing)}
            className={listing.address === selectedListing.address ? 'selected' : ''}
            src={`data:image/jpeg;base64,${listing.image}`} 
            alt={listing.address}
          />
        ))}
      </div>
    </div>
  );
}




export default MarkerPopup;
