import React from 'react'
import { ConnectButton } from 'web3uikit'

const Header = () => {
  return (
    <div>
        <p>Decentralized Lottery</p>
      <ConnectButton moralisAuth={false}/>
    </div>
  )
}

export default Header
