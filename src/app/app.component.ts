import { Component } from '@angular/core';
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import fetch from 'cross-fetch';
const APIURL = 'https://api-mumbai.lens.dev/';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'desource';
  apolloClient: any;
  constructor(){
    this.apolloClient= new ApolloClient({
      uri: APIURL,  link: new HttpLink({ uri: APIURL, fetch }),
      cache: new InMemoryCache(),
    })
    this.launchquery()
  }

  async launchquery() {
    const query  = `
    query {
      ping
    }
  `
  
     const response = await this.apolloClient.query({
      query: gql(query),
    })
    console.log('Lens example data: ', response)

    const GET_CHALLENGE = `
    query($request: ChallengeRequest!) {
      challenge(request: $request) { text }
    }
  `;

    const myREsponse = await this.apolloClient.query({
      query: gql(GET_CHALLENGE),
      variables: {
        request: {
          address:"0x464B916c32e9aB72CFA5E94a4aB768797b46A1dD"
        },
      },
    });
    console.log('Lens example data: ', myREsponse)

  }
}
