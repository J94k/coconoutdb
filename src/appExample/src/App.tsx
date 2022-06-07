import React, { useState, useEffect, BaseSyntheticEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { Store, Data } from 'coconoutdb'
import { connectMetamask, Wallet } from './utils'
import { RINKEBY } from './constants'

export default observer(function App() {
  const [walletData, setWalletData] = useState<undefined | Wallet>(undefined)
  const [store] = useState(
    new Store({
      rpc: RINKEBY.rpc,
      address: RINKEBY.storage,
      // @ts-ignore
      provider: window.ethereum,
      dataKey: 'localhost',
    })
  )

  useEffect(() => {
    const connect = async () => {
      const data = await connectMetamask()

      setWalletData(data)
    }

    connect()
  }, [])

  useEffect(() => {
    try {
      store.readFromService()
    } catch (error) {
      console.error(error)
    }
  }, [store])

  const [userKey, setUserKey] = useState('')
  const [userValue, setUserValue] = useState('')
  const [nothingToChange, setNothingToChange] = useState(!userKey || !userValue)

  useEffect(() => {
    setNothingToChange(!userKey || !userValue)
  }, [userKey, userValue])

  const onKeyChange = (event: BaseSyntheticEvent) => setUserKey(event.target.value)
  const onValueChange = (event: BaseSyntheticEvent) => setUserValue(event.target.value)

  const onSaveData = async () => {
    store.set(userKey, userValue)

    try {
      store.saveToService()
    } catch (error) {
      console.error(error)
    }
  }

  const notRinkeby = !walletData || walletData?.chainId !== RINKEBY.id

  return (
    <div className="container">
      <div className="column">
        <h2>Saved settings</h2>
        {store.data ? (
          <>
            <textarea
              className="savedDataContainer"
              value={JSON.stringify(store.data, undefined, 2)}
              cols={54}
              rows={32}
              readOnly
            />
          </>
        ) : (
          'Loading...'
        )}
      </div>

      <div className="column">
        <h2>Settings to change</h2>
        <div className="column">
          <input className="input" placeholder="Key" value={userKey} onChange={onKeyChange} />
          <input className="input" placeholder="Value" value={userValue} onChange={onValueChange} />

          <button
            className="button"
            onClick={onSaveData}
            disabled={notRinkeby || nothingToChange || store.loading}
          >
            {notRinkeby
              ? 'Switch to RINKEBY'
              : nothingToChange
              ? 'Set key and value first'
              : 'Change'}
          </button>
        </div>
      </div>
    </div>
  )
})
