
# E-voting on a blockchain: an implementation using the Bitcoin Protocol

The site is hosted at https://vote-eta.vercel.app/

The goals of this project
* Implement electronic voting using the Bitcoin Protocol using Smart Contracts
* Compare implementation costs
* Investigate the issues surrounding e-voting to make it secure, auditable, confidential and therefore trusted.

# What was accomplished
* A voting site was created using the BitcoinSV blockchain 
  - Links to help citizens find information on votings and voter registration status
  - Election creation and maintaining a voter list
  - Distribute vote tokens to registered voters
  - Sample screen where voter would cast ballot
  - Vote results tabulation
  
 * A smart contract for voting was created to run on the Bitcoin Protocol
 
 * A cost comparison was performed to ascertain the lowest cost chain
 
 * Research was performed to transition the implementation from a "naive" approach to a more robust implementation.
 
 # Future Directions for Blockchain voting
 
 E-voting System Based on the Bitcoin Protocol
and Blind Signatures
https://ipsj.ixsq.nii.ac.jp/ej/?action=repository_action_common_download&item_id=157919&item_no=1&attribute_id=1&file_no=1

Bitcoin is a public blockchain that does not use encryption at the base layer. Voting requires privacy and confidentiality. Confidential voting can be layered on top of Bitcoin using cryptographic primatives. There are at least three available approaches that could extend Bitcoin with privacy:
1) Blind Signatures with bit commitment
2) Zero Knowledge proof with oblivious transfer
3) Homomorphic encryption

The approach that was most deeply investigated was Blind Signatures based on the classic David Chaum work. Zero Knowledge Proof and Homomorphic encryption seemed to be probablistic in nature and therefore were more compute intensive. Additional confidentiality schemes can be investigated further.

* Completeness: An eligible voter is always accepted by the administrator
and all valid votes are counted correctly.

* Robustness/Soundness: Dishonest voters and other participants
cannot disturb/disrupt an election.

* Anonymity/Privacy: All votes must be secret; and neither voting
authorities nor anyone else can link a vote to the voter who
has cast a vote.

* Unreusability: A voter cannot vote more than once.

* Fairness: Early results should not be obtained, as they could
influence the remaining voters.

* Eligibility: Only legitimate voters can vote.

* Individual verifiability: A voter can verify that his/her vote
was really counted.

* Universal verifiability: Anybody can verify that the published
outcome really is the sum of all votes.

The time constrains of the Hackathon did not permit the full implementation of all these attributes. However, the research strongly suggests that these desirable attributes are able to be fully implemented on top of the Bitcoin Protocol.

