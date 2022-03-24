
import { Inject, Injectable } from '@angular/core';
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch';
const APIURL = 'https://api-mumbai.lens.dev/';



@Injectable({
  providedIn: 'root',
})
export class LensApiService {
    apolloClient: any;
  loading = true;
  constructor( ) {
    this.apolloClient= new ApolloClient({
        uri: APIURL,  link: new HttpLink({ uri: APIURL, fetch }),
        cache: new InMemoryCache(),
      })
      this.getProfiles();
      this.challengeQuery("0xdd2fd4581271e230360230f9337d5c0430bf44c0")
  }

async getProfiles (){
    const GET_PROFILES =    `query Profiles {
        profiles(request: { profileIds: ["0x01","0x02"], limit: 10 }) {
          items {
            id
            name
            bio
            location
            website
            twitterUrl
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            handle
            coverPicture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            ownedBy
            depatcher {
              address
              canUseRelay
            }
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
            followModule {
              ... on FeeFollowModuleSettings {
                type
                amount {
                  asset {
                    symbol
                    name
                    decimals
                    address
                  }
                  value
                }
                recipient
              }
              __typename
            }
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }`
      const apiQuery = await this.apolloClient.query({
        query: gql(GET_PROFILES),
      });
      console.log('Lens example data: ', apiQuery.data)
}


async challengeQuery(address:string){
    const GET_CHALLENGE = `
    query($request: ChallengeRequest!) {
      challenge(request: $request) { text }
    }
  `;
    const apiQuery = await this.apolloClient.query({
      query: gql(GET_CHALLENGE),
      variables: {
        request: {
          address
        },
      },
    });
    console.log('Lens example data: ', apiQuery.data.challenge.text)
    return apiQuery.data.challenge.text

  }


  // async getFileObervable(hash:string){
  //   let myObject = '';
  //   from(this.ipfs.cat(hash)).pipe( 
  //     switchMap((buffer: Buffer) => {

  //     })
  //   )
  // }

 

  
 
 
}
