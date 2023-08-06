import React, { useState } from 'react';
import AWS from 'aws-sdk';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { AWS_CONFIG } from '../config';

const S3_BUCKET = 'aptjson';

AWS.config.update(AWS_CONFIG); 

const s3 = new AWS.S3();

const UploadJSONToS3 = ({ onComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const ref = React.useRef()

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    handleUpload(e.target.files)
  };

  const handleUpload = (selectedFiles) => {
    let successfulUploads = 0;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file) {
        const params = {
          Bucket: S3_BUCKET,
          Key: file.name,
          Body: file,
        };
  
        s3.upload(params, (err, data) => {
          if (err) {
            console.error('Error uploading file:', err);
          } else {
            console.log('File uploaded successfully:', data.Location);
            // Add your desired logic here, e.g., displaying a success message.
            successfulUploads++;

            if (successfulUploads === selectedFiles.length) {
              onComplete && onComplete(new Date().toString());
            }

          }
        }); 
      }
   
    }
 
 

  };

  return (
    <Stack direction="row" spacing={1}> 
      <input ref={ref} style={{ display: "none" }} type="file" multiple accept=".json" onChange={handleFileChange} />
      <Button size="small" variant='contained' onClick={() => {
        ref.current.click()
      }}>add</Button>
    </Stack>
  );
};

export default UploadJSONToS3;
