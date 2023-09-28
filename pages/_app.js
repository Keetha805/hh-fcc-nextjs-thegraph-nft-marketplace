import Header from "../components/Header";

import "../styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NotificationProvider } from "web3uikit";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/45314/nft-marketplace/v0.0.2",
});

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace"></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
            <Header></Header>
            <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}
