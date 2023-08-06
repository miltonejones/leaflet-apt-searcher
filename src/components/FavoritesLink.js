import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { Link } from '@mui/material';
import { AWS_CONFIG } from '../config';

const S3_BUCKET = 'aptjson';
AWS.config.update(AWS_CONFIG); 
const s3 = new AWS.S3();


const FavoritesLink = ({ jsonData, onChange }) => {
  const [isFavorite, setIsFavorite] = useState(jsonData.favorite);

  const handleButtonClick = () => {
    // Toggle the favorite property and update the state
    const updatedJsonData = { ...jsonData, favorite: !isFavorite };
    setIsFavorite(!isFavorite);

    // Save the updated JSON to AWS S3
    saveToAWSS3( updatedJsonData);
  };

  const saveToAWSS3 = ( data) => { 
  
    // Upload the JSON data to S3
    s3.upload(
      {
        Bucket: S3_BUCKET,
        Key: jsonData.fileName,
        Body: JSON.stringify(data),
        ContentType: 'application/json',
      },
      (err, data) => {
        if (err) {
          console.error('Error uploading to AWS S3:', err);
        } else {
          console.log('File uploaded to AWS S3:', data);
          onChange && onChange()
        }
      }
    );
  };

  return (
    <Link sx={{
      cursor: 'pointer'
    }} onClick={handleButtonClick}>
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </Link>
  );
};

export default FavoritesLink;
