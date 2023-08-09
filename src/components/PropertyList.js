/**
 * A React component that renders a list of properties, with the ability to click on a property and perform an action 
 * @component
 * @param {boolean} visible - A boolean flag that determines if the property list should be displayed or not 
 * @param {Array} properties - An array of properties to be rendered in the list 
 * @param {function} itemClicked - A function that is called when a property is clicked 
 * @returns {JSX.Element} - A React component that renders a list of properties 
 */
import React from 'react';
import { Typography, Link, Grid } from '@mui/material';
import Stack from '@mui/material/Stack'; 
import ImageUploader, { createImage } from './ImageUploader';
import DeleteListingComponent from './ListingDelete';

 

export const PropertyGrid = ({ visible, properties, itemClicked, onUpdate }) => {

  return (
    <>
      {!!visible && 
        <Grid container spacing={2} sx={{ p: 2, position: 'absolute', top: 80, width: 'calc(100vw - 16px)' }}>
      

          {properties.map(item => (
            <Grid item xs={!!item.label?12:6} sm={!!item.label?12:4} md={!!item.label?12:3} key={item.id}>
              <Stack>
                  
                {!item.label && <ImageUploader object={item} onChange={onUpdate}   onClick={() => !!item.address && itemClicked(item)} />}

                {!!item.label && <Typography variant="h6">{item.label}</Typography>}

                {!item.label && <Typography 
                  sx={{ 
                    cursor: 'pointer',      
                    width: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  variant="body2"
                  onClick={() => !!item.address && itemClicked(item)}
                >
                  {item.favorite && '❤️ '} 
                  {item.address || item.label}
                </Typography>}

                <Typography   variant="caption" sx={{
                  width: '90%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} > {item.rentalDetails?.rentPrice}</Typography>

                <Stack direction="row" spacing={2}>
                  {!item.label && (
                    <>
                    <Link target="_blank" href={item.url}>Open Listing</Link>
                  <DeleteListingComponent filename={item.fileName} onChange={onUpdate}  />
                    </>
                  ) }
                </Stack>

              </Stack>
            </Grid>
          ))}

        </Grid>
      }
    </>
  );
}
 




const PropertyList = ({ visible, properties, itemClicked }) => {
  // Only render property list if visible flag is true
  return (
    <>
    {!!visible && 
      <Stack
        // Set stack's position to absolute and top to 80
        sx={{
          position: 'absolute',
          top: 80
        }}
      >
        <Typography sx={{ mb: 2 }}>Select a property to continue:</Typography>
        {properties.map(item => 
          <Typography
            // Set typography element's cursor to pointer and margin bottom to 1
            sx={{ 
              cursor: 'pointer', 
              mb: 1 
            }}
            // Check if item has an address, if so, call itemClicked function
            onClick={() => !!item.address && itemClicked(item)}
            // Set typography element's variant to subtitle2 if item doesn't have an address, body2 otherwise
            variant={!item.address ? 'subtitle2' : 'body2'}
          >
            {/* Render a heart emoji if item is favorited */}
            {item.favorite ? '❤️' : ''} {item.address || item.label}
          </Typography>
        )}
      </Stack>
    }    
    </>
  );
};

export default PropertyList;
