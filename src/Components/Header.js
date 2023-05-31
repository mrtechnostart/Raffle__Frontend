import React from 'react'
import { ConnectButton } from 'web3uikit'

const Header = () => {
  return (
    <>
    <div className='d-flex flex-column flex-sm-row justify-content-between m-5 align-items-center'>
        <p className='h3'>Decentralized Lottery</p>
      <ConnectButton moralisAuth={false}/>
    </div>
    <hr/>
    </>
  )
}

export default Header
