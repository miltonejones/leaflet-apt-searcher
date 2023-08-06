import React from 'react'; 
 
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import UploadJSONToS3 from './JSONUpload';

const ChatterBox = ({ chatMem, setRefresh, querying, chatQuestion, setChatQuestion, selectedProperty, handleSubmit }) => {
  const [ show, setShow ] = React.useState(false);

  if (!selectedProperty.title ) {
    return <i />
  }

  const bottom = show ? 10 : -1000;



  return (
   
    <>

    <Box sx={{
        zIndex: 2000,
        position: 'fixed',
        bottom: show ? -1000 : 100,
        transition: 'all 0.3s linear',
        right: 18,  
    }}>
      <UploadJSONToS3 onComplete={() => setRefresh(new Date().toString())} />
    </Box>

    <Box sx={{
        zIndex: 2000,
        position: 'fixed',
        bottom: show ? -1000 : 30,
        transition: 'all 0.3s linear',
        right: 10,  
    }}>
      <Fab color="primary"  onClick={() => setShow(true)}>
        <ChatIcon />
      </Fab>
    </Box>

    <div
      style={{
        zIndex: 2000,
        position: 'fixed',
        bottom,
        transition: 'all 0.3s linear',
        right: 10,
        maxWidth: 400,
        maxHeight: 500,
        overflow: 'hidden'
      }}
     >

      <Card sx={{
        p: 1
      }}>
        <Stack direction="row" sx={{
          alignItems: 'center',
          justifyContent: "space-between"
        }}>
          <Typography variant='subtitle2'>Chat</Typography>
          <IconButton onClick={() => setShow(false)} size="small"
            >
              <CloseIcon />
            </IconButton>
        </Stack>

         <Box 
          sx={{
            mb: 1,
            maxHeight: 380,
            overflow: 'scroll'
          }}
         >
         {chatMem.map((c, m) => <ChatText key={m} {...c} />)}
         </Box> 

          {!!querying && <LinearProgress />}

      <form onSubmit={handleSubmit}  >
      <TextField   
      autoComplete='off'
        fullWidth
          onChange={e => {
            setChatQuestion(e.target.value)
          }}
          value={chatQuestion}
          sx={{
            minWidth: 360
          }}
          size="small"
          placeholder={`Ask me anything about ${selectedProperty.address}`}
        />
      </form>        
      </Card>


    </div>
    
    </>

  );
};


function ChatText({ role, content }) {
  return <Box
      sx={{
        display: 'flex',
        m: 1,
        flexDirection: 'row',
        justifyContent: role === 'user' ? 'flex-end' : 'flex-start'
      }}
    >
  <Box sx={{
    backgroundColor: t => role === 'user' ? t.palette.primary.light : t.palette.grey[200],
    color: t => role === 'user' ? t.palette.common.white : t.palette.grey[900],
    borderRadius: 2,
    p: 1
  }}>
  <Typography variant='body2'> {content}</Typography>
  </Box>
  </Box>
}
 
 
export default ChatterBox;
