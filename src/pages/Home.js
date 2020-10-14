import React, {useEffect} from "react";
import {
  useHistory
} from "react-router-dom"
import ScriptTag from 'react-script-tag';
//import {Helmet} from 'react-helmet'
import { Button, Grid, Link, Typography} from '@material-ui/core'
import HomeCard from './../components/HomeCard.js'

export default function Home() {
  return (
          <div>
            {/* <Helmet>
              <script type="text/javascript" src="https://tool.votinginfoproject.org/app.js"></script>
              <script type="text/javascript" src="/vip.js"></script>
            </Helmet> */}
              <Grid item md={6}>
                <Button href="https://sos.wyo.gov/elections/state/registeringtovote.aspx">Register to Vote</Button>
                <Button href="https://sos.wyo.gov/faqs.aspx?root=ELEC">Election FAQs</Button>
                {/* <Button href="">Am I registered?</Button> */}
              </Grid>
              <Grid container style={{paddingTop: "50px", paddingBottom: "100px", backgroundColor:"#000", color:"#fff"}} >
              <Grid item md={6} xs={12}  align='center'>
                <div>
                  <h1 align='center'> <span className="script big-head" > Wyoming Vote </span> <br />on Bitcoin.</h1>
                  <h4 align='center'> <Link style={{color:"#fff"}} href="www.bitcoincomputer.io" >With BitcoinComputer.io </Link></h4>
                  <img src="https://www.cleveroad.com/images/article-previews/smart-contract-1.png" width="50%" />
                </div>
              </Grid>
              <Grid item xs={12} md={6} align='center'>
                <HomeCard image_url="https://www.thebedfordcitizen.org/wp-content/uploads/2020/06/vote-464x464-1.png" headText='Voting'></HomeCard>
              </Grid>
              <Grid item md={12} style={{marginTop:"10px"}}>
              <iframe src="https://verify.vote.org/?partner=111111&campaign=free-tools" width="100%" height="900" marginheight="0" frameborder="0" id="frame1" scrollable ="no"></iframe>
              <ScriptTag isHydrating={true} type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.3/iframeResizer.min.js"></ScriptTag>
              {/* <script type="text/javascript">
                iFrameResize({ log:true, checkOrigin:false});
              </script> */}
              </Grid>
              {/* <Grid>
                <ScriptTag isHydrating={true} type="text/javascript" src="https://tool.votinginfoproject.org/app.js" />
                <div id="_vit"></div>
                <ScriptTag isHydrating={true} type="text/javascript" src="/vip.js" />
              </Grid> */}
            </Grid>
          </div>)
}

