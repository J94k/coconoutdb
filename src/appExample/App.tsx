import React, { useState, useEffect } from 'react'
import { Store, Data } from 'coconoutdb'

const RINKEBY = {
  id: 4,
  storage: '0xd2baDd65d97549EB8af9B83BcD74768c9ebaeC31',
  rpc: 'https://rinkeby.infura.io/v3/fc55ddb25b694fef8e2363f6b6c9341f',
}

const dataContainer = {
  fontSize: '1.2rem',
}

export default function App() {
  const [data, setData] = useState<Data | null>(null)
  const [store] = useState(
    new Store({
      rpc: RINKEBY.rpc,
      address: RINKEBY.storage,
      provider: '',
      dataKey: 'localhost',
    })
  )

  useEffect(() => {
    const fetch = async () => {
      try {
        await store.readFromService()

        setData(store.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetch()
  }, [store])

  return (
    <div>
      {data ? (
        <textarea
          style={dataContainer}
          value={JSON.stringify(data, undefined, 2)}
          cols={54}
          rows={32}
          readOnly
        />
      ) : (
        'Loading...'
      )}
    </div>
  )
}
