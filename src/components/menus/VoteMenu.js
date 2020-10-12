import React from 'react';
import {useHistory} from 'react-router-dom'
import Button from '@material-ui/core/Button';

export default function VoteMenu({classes}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  let history = useHistory()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button id="btnVoters" aria-controls="fade-menu" 
        href="/elections/voters"
        aria-haspopup="true" onClick={handleClick} variant="contained" color="default" 
        className={classes.link}>
        Voter List
      </Button>
      <Button id="btnElections" aria-controls="fade-menu" 
        href="/elections"
        aria-haspopup="true" onClick={handleClick} variant="contained" color="default" 
        className={classes.link}>
        Election 
      </Button>
      <Button id="btnResults" aria-controls="fade-menu" 
        href="/elections/results"
        aria-haspopup="true" onClick={handleClick} variant="contained" color="default" 
        className={classes.link}>
        Election Results
      </Button>
      <Button id="btnVote" aria-controls="fade-menu" 
        href="/elections/vote"
        aria-haspopup="true" onClick={handleClick} variant="contained" color="default" 
        className={classes.link}>
        Vote
      </Button>
    </div>
  )
}
