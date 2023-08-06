import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { AWS_CONFIG } from '../config';

const S3_BUCKET = 'aptjson';

AWS.config.update(AWS_CONFIG); 


const s3 = new AWS.S3();

const ListAndLoadJSONFromS3 = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [jsonContent, setJsonContent] = useState(null);

  useEffect(() => {
    const listFiles = async () => {
      try {
        const params = {
          Bucket: S3_BUCKET,
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents) {
          const files = data.Contents.map((file) => file.Key);
          setFileList(files);
        }
      } catch (error) {
        console.error('Error listing files:', error);
      }
    };

    listFiles();
  }, []);

  const handleFileSelect = async (event) => {
    const selectedFileName = event.target.value;

    try {
      const params = {
        Bucket: S3_BUCKET,
        Key: selectedFileName,
      };

      const data = await s3.getObject(params).promise();

      if (data.Body) {
        const json = JSON.parse(data.Body.toString());
        setJsonContent(json);
      }
    } catch (error) {
      console.error('Error loading JSON:', error);
    }

    setSelectedFile(selectedFileName);
  };

  return (
    <div> 
      <select value={selectedFile} onChange={handleFileSelect}>
        <option value="">Select a file</option>
        {fileList.map((fileName, index) => (
          <option key={index} value={fileName}>
            {fileName}
          </option>
        ))}
      </select>
      {jsonContent && (
        <div>
          <h2>JSON Content</h2>
          <pre>{JSON.stringify(jsonContent, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ListAndLoadJSONFromS3;
