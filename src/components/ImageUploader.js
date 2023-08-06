import React, { useState } from 'react';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { AWS_CONFIG } from '../config';

const S3_BUCKET = 'aptjson'; 
AWS.config.update(AWS_CONFIG); 

const s3 = new AWS.S3();

const ImageUploader = ({ onChange, object }) => {
  const ref = React.useRef()
  const [image, setImage] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        setImage(base64Image);

        // Update the object with the base64 image
        const updatedObject = { ...object, image: base64Image };

        // Save the JSON object to S3
        const objectId = uuidv4(); // Generate a unique ID for the object
        const params = {
          Bucket: S3_BUCKET,
          Key: object.fileName,
          Body: JSON.stringify(updatedObject)
        };

        try {
          await s3.putObject(params).promise();
          console.log('Object saved to S3');
          onChange && onChange()
        } catch (error) {
          console.error('Error saving object to S3:', error);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {!object.image && <input ref={ref} type="file" style={{
        display: 'none'
      }} accept="image/*" onChange={handleFileChange} />}
      {!object.image && <img onClick={() => ref.current.click()} src={`${createImage()}`} alt="Uploaded" style={{
        width: '100%',
        minWidth: 240
      }} />}
      {object.image && <img onClick={() => ref.current.click()} src={`data:image/jpeg;base64,${object.image}`} alt="Uploaded" style={{
        width: '100%',
        minWidth: 240
      }} />}
    </div>
  );
};

export default ImageUploader;

// Function to draw the text in the center of the canvas
function drawTextOnCanvas(canvas, text) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000"; // Text color
  ctx.font = "20px Arial"; // Font size and style
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Calculate the center position of the canvas
  var x = canvas.width / 2;
  var y = canvas.height / 2;

  // Draw the text in the center
  ctx.fillText(text, x, y);
}

// Function to create the image with the text
function createImage() {
  var canvas = document.createElement("canvas");
  drawTextOnCanvas(canvas, "Click here to add a photo");

  return canvas.toDataURL("image/png"); 
}
