import React from "react";
import {
  useHistory
} from "react-router-dom";
import { Button, Grid, Link, Typography} from '@material-ui/core'
import HomeCard from './../components/HomeCard.js'


export default function Home() {
  return (
          <div>
            <Grid container style={{paddingTop: "150px", paddingBottom: "100px", backgroundColor:"#000", color:"#fff"}} >
              <Grid item md={6} xs={12}  align='center'>
                <div>
                  <h1 align='center'> <span className="script big-head" > Wyoming Vote </span> <br />on Bitcoin.</h1>
                  <h4 align='center'> <Link style={{color:"#fff"}} href="www.bitcoincomputer.io" >With BitcoinComputer.io </Link></h4>
                  <img src="https://www.cleveroad.com/images/article-previews/smart-contract-1.png" width="50%" />
                </div>
              </Grid>
              <Grid item md={6} >
              <Grid item xs={12} md={6} align='center'>
                <HomeCard image_url="https://www.thebedfordcitizen.org/wp-content/uploads/2020/06/vote-464x464-1.png" headText='Voting'></HomeCard>
              </Grid>
              </Grid>
            </Grid>
          </div>)
}

