import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Computer from 'bitcoin-computer'
import Mnemonic from 'bsv/mnemonic'
import {Avatar, Button, Card, Container, CssBaseline, TextField, Typography, Grid} from '@material-ui/core'
import FileUtils from './../utilities/FileUtils.js'
import SendIcon from '@material-ui/icons/Send'
import * as Constants from './../constants/LocalStorageConstants.js'

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(1),
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
  

function MintElection({computer}){
    // const [votes, setVotes] = useState(0)
    const [title, setTitle] = useState('')
    const [election, setElection] = useState(null)
    const [creating, setCreating] = useState(false)
    const initCan1 = localStorage.getItem(Constants.CANDIDATE1)
    const can1 = !initCan1?null:JSON.parse(initCan1)
    const initCan2 = localStorage.getItem(Constants.CANDIDATE2)
    const can2 = !initCan2?null:JSON.parse(initCan2)
    const [can1name, setCan1Name] = useState(!can1 ? '':can1.name)
    const [can2name, setCan2Name] = useState(!can2 ? '':can2.name)
    // const [can3name, setCan3Name] = useState('')
    const [can1PK, setCan1PK] = useState(!can1 ? '':can1.key.public)
    const [can2PK, setCan2PK] = useState(!can2 ? '':can2.key.public)
    // const [can3PK, setCan3PK] = useState('')
 
    const handleSubmit = async (e) => {
      if (!can1PK || !can2PK || !title) return
        setCreating(true)
        try{
            e.preventDefault()
            const pubKey = await computer.db.wallet.getPublicKey().toString()
            console.log("Public Key: " + pubKey)
            const ELECTION = await FileUtils.importFromPublic('/contracts/Vote.js')
            console.log(`Created Election from file \n ${ELECTION}`)
            const voters = getVoters()
            let _election = await computer.new(ELECTION, [pubKey, pubKey, title, 
              voters.length, can1name, can1PK, 
              can2name, can2PK, 
              // can3name, can3PK
            ])
            console.log("created Election on the blockchain. ")
            setElection(_election)
            console.log("set election complete")
            console.log(_election)
            console.log("Successfully created " + _election.votes + "for " + _election.name  )
        }catch (err){
            if(err.message.startsWith('Insufficient balance in address')){
                alert(`You need testnet coins to mint a token. To get free testnet coins open your wallet.`)
            } else {
                alert(err)
            }
        }
        setCreating(false)
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

    const addCandidate1 = () => {
      //if (!name && !nameInput.current.value) return
      //const voters = getVoters()
      const mn = Mnemonic.fromRandom()
      const computer = new Computer({
          seed: mn.toString(),
          chain: "BSV", 
          network: "testnet"
        })
      const newCandidate1 = {
          name: "Candidate 1",
          seed: mn.toString(),
          key:{
              private:computer.db.wallet.getPrivateKey().toString(),
              public:computer.db.wallet.getPublicKey().toString()
          }
      }
      setCan1Name(newCandidate1.name)
      setCan1PK(newCandidate1.key.public)
      localStorage.setItem(Constants.CANDIDATE1,JSON.stringify(newCandidate1))
    }

    const addCandidate2 = () => {
      //if (!name && !nameInput.current.value) return
      //const voters = getVoters()
      const mn = Mnemonic.fromRandom()
      const computer = new Computer({
          seed: mn.toString(),
          chain: "BSV", 
          network: "testnet"
        })
      const newCandidate2 = {
          name: "Candidate 2",
          seed: mn.toString(),
          key:{
              private:computer.db.wallet.getPrivateKey().toString(),
              public:computer.db.wallet.getPublicKey().toString()
          }
      }
      setCan2Name(newCandidate2.name)
      setCan2PK(newCandidate2.key.public)
      localStorage.setItem(Constants.CANDIDATE2,JSON.stringify(newCandidate2))
    }

    const classes = useStyles()
    return(<div align='center'> 
        <Container component="main"  >
          <CssBaseline />
          <Card className={classes.paper} >
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create An Election
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <label>{`${getVoters().length} Voters`}</label>
              {/* <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="number"
                id="votes"
                label="How Many Votes Do You Want To Create in This Election?"
                name="votes"
                defaultValue={votes}  onChange={(e) => setVotes(e.target.value)}
              /> */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Title of Your Election"
                type="text"
                id="name"
                name="name" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button onClick={() => addCandidate1()}>Add Candidate 1</button>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 1"
                type="text"
                id="can1name"
                name="can1name" 
                value={can1name}
                onChange={(e) => setCan1Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 1"
                type="text"
                id="can1PK"
                name="can1PK" 
                value={can1PK}
                onChange={(e) => setCan1PK(e.target.value)}
              />
              <button onClick={() => addCandidate2()}>Add Candidate 2</button>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 2"
                type="text"
                id="can2name"
                name="can2name" 
                value={can2name}
                onChange={(e) => setCan2Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 2"
                type="text"
                id="can2PK"
                name="can2PK" 
                value={can2PK}
                onChange={(e) => setCan2PK(e.target.value)}
              />
              {/* <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Name of Candidate 3"
                type="text"
                id="can3name"
                name="can3name" 
                value={can3name}
                onChange={(e) => setCan3Name(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Public Key of of Candidate 3"
                type="text"
                id="can3PK"
                name="can3PK" 
                value={can3PK}
                onChange={(e) => setCan3PK(e.target.value)}
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Create New Election
              </Button>
            </form>
          </Card>
          {creating && (<div>Creating The Election...</div>)}
        </Container>
    </div>)
}

export default MintElection