import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import AWS from 'aws-sdk';
import { AWS_CONFIG } from '../config';
import { Typography } from '@mui/material';

const S3_BUCKET = 'aptjson'; 
AWS.config.update(AWS_CONFIG); 

const s3 = new AWS.S3();

const DeleteListingComponent = ({ onChange, filename }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClicked = () => {
    // Implement your delete logic here
    s3.deleteObject(
      {
        Bucket: 'aptjson',
        Key: filename,
      },
      (err, data) => {
        if (err) {
          console.error('Error deleting file:', err);
          // Handle error, display an error message, etc.
        } else {
          console.log('File deleted successfully:', data);
          onChange()
        }
        handleCloseModal();
      }
    );
  };

  return (
    <div> 
      &times;  <Link sx={{
      cursor: 'pointer'
    }} onClick={handleOpenModal}>
    Delete
    </Link>
 

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack>
            
            <Typography>Are you sure you want to delete this listing?</Typography>
            <Typography variant='caption'>{filename}</Typography>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClicked} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteListingComponent;
