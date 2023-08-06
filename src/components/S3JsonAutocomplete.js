import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; 
import Card from '@mui/material/Card'; 
import { AWS_CONFIG } from '../config';

const S3_BUCKET = 'aptjson'; 

console.log ({ AWS_CONFIG })
AWS.config.update(AWS_CONFIG);


const s3 = new AWS.S3();

const S3JsonAutocomplete = ({ onChange, refresh, setRefresh, jsonList, setJsonList }) => { 

  useEffect(() => {
    const fetchJsonFiles = async () => {
      try {
        const params = {
          Bucket: S3_BUCKET,
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents) {
          const fileList = data.Contents.map((file) => file.Key);

          const jsonObjects = await Promise.all(
            fileList.map(async (fileName) => {
              const jsonParams = {
                Bucket: S3_BUCKET,
                Key: fileName,
              };

              const jsonData = await s3.getObject(jsonParams).promise();
              const jsonObject = JSON.parse(jsonData.Body.toString());
              return {
                ...jsonObject,
                selected: false,
                fileName
              };
            })
          );

          setJsonList(jsonObjects);
        }
      } catch (error) {
        console.error('Error fetching JSON files:', error);
      }
    };

    fetchJsonFiles();
  }, [refresh]);

  let label = ''
  const sortedFiles = jsonList
    .sort(( a,b ) => a.city < b.city ? 1 : -1)
    .reduce((out, item) => {
      if (item.city !== label) {
        label = item.city
        out.push({
          label
        })
      }
      out.push(item)
      return out;

    }, [])

  return (
    <Card  sx={{
      p: 1
    }}> 
      <Autocomplete
        size="small"
        options={sortedFiles}
        renderOption={(props, option) => (
          <div {...props} sx={{
            textAlign: 'left',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
          }}>
          { !!option.address &&  <>{option.favorite ? '❤️' : ''} {option.address}</>}
           {!!option.label && <div style={{ color: 'gray' }}>{option.label}</div>}
          </div>
        )}
        getOptionLabel={(option) => option.address}
        onChange={(event, value) => onChange(value)}
        renderInput={(params) => <TextField sx={{
          minWidth: 400
        }} size="small" {...params} label="Select an address" />}
      />
 
      {/* <UploadJSONToS3 onComplete={(location) => {
          setRefresh(location)
      }} /> */}
    </Card>
  );
};

export default S3JsonAutocomplete;
