import React from 'react';
import Typography from '@mui/material/Typography';

const Divider = (props) => {
    return(
        <div>
            <span style={{color: "#B3B6B7"}}>_____</span>
            <Typography display='inline' sx={{m:5}}><b>{props.title}</b></Typography>
            <span style={{color: "#B3B6B7"}}>_____</span>
        </div>
    );
}

export default Divider;