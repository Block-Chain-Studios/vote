import React, { useState, useEffect } from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Button, TextField} from '@material-ui/core'
import * as Constants from './../constants/LocalStorageConstants.js'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  darkPaperLeft: {
    padding: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    backgroundColor: '#000', color: '#fff'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

function SendVote({ computer, votes, voter }) {
  const [amount, setAmount] = useState(1)
  const [vote] = useState(votes[0])
  //voter to send to
  const [to, setTo] = useState(voter ? voter.key.public:null)

  useEffect(()=>{
    console.log(voter)
    if (votes && votes.length>0) console.log(votes[0].distributor + " " + votes[0].cand1PK)
  })

  const send = async (e) => {
        e.preventDefault()
        console.log(to)
        console.log(vote._owners + "   " + vote.distributor)
        if (to) {
          let tx = await vote.distribute(to)
          // update local storage
          const voters = getVoters()
          const voterUpdate = voters.find(v => v != null && v.name===voter.name)
          voterUpdate.votetx = tx
          saveVoters(voters)
          console.log('Sent vote to\n ' + to + '\n ' + tx.toString())
        }
    }

    const saveVoters = (voters) => {
        localStorage.setItem(Constants.VOTERS,JSON.stringify(voters))
    }
    const getVoters = () => {
      let voters = localStorage.getItem(Constants.VOTERS)
      if (!voters) return []
      if (voters.length === 0) return []
      //console.log(voters)
      try {
          return JSON.parse(voters)
      } catch (err) {
          console.error(voters)
          return []
      }
  }

  const classes = useStyles()
  return (
<form className={classes.form} noValidate  onSubmit={send}>
  <label>{voter === null? '':voter.name}</label>
<TextField
  variant="outlined"
  margin="normal"
  required
  fullWidth
  align='center'
  id="sendToPK"
  label="Send 1 Vote To Public Key"
  name="sendToPublickKey"
  value={to}
  onChange={(e) => setTo(e.target.value)}
  />

<Button
  type="submit"
  fullWidth
  variant="contained"
  color="primary"
  className={classes.submit}
>
  Send Vote
</Button>
</form>
    )
}

export default SendVote
