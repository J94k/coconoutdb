import Web3 from 'web3'
import StorageBuild from './abi/storage.json'
import { log, Log } from './utils'
import { ZERO_ADDRESS } from './constants'

export type Data<Key extends string = string, Value = any> = {
  [k in Key]: Value
}

export type ChainParams = {
  address?: string
  rpc?: string
  provider?: any
}

export type SaveParams = {
  key: string
  data: Data
  owner: string
  onHash?: (hash: string) => void
  onReceipt?: (receipt: any) => void
}

export interface ChainInterface {
  readonly address: string
  readonly rpc: string
  readonly provider: string
  readonly instance: any
  readonly signerInstance: any

  merge: (params: { oldData?: Data; newData?: Data }) => Data
  save: (params: SaveParams) => Promise<any>
  fetch: (key: string) => Promise<{
    data: Data
    owner: string
  }>
  clear: (key: string) => Promise<any>
}

const methodPlug = (params: any) => {}

export default class Chain implements ChainInterface {
  address
  rpc
  provider
  instance
  signerInstance

  constructor({ address, rpc, provider }: ChainParams) {
    try {
      // For the requests that don't change a blockchain state.
      // We can init it and use from any network
      const web3 = new Web3(rpc || '')
      // For the requests that change the state.
      // It works only when we're on the provider network during the changes.
      const signerWeb3 = new Web3(provider || '')

      this.address = address
      this.provider = provider
      this.instance = new web3.eth.Contract(StorageBuild.abi as any[], address)
      this.signerInstance = new signerWeb3.eth.Contract(StorageBuild.abi as any[], address)
    } catch (error) {
      log({ value: error, title: 'new Chain', type: Log.error })
      throw error
    }
  }

  merge({ oldData = {}, newData = {} }) {
    try {
      const data = { ...oldData }

      Object.keys(newData).forEach((newKey) => {
        const newValue = newData[newKey]

        if (
          newValue !== Object(newValue) ||
          // do we need to check array values and update each of them the same way?
          Array.isArray(newValue) ||
          // functions won't be in the data in any case
          typeof newValue === 'function'
        ) {
          data[newKey] = newValue
        } else {
          data[newKey] = this.merge({
            oldData: data[newKey],
            newData: newValue,
          })
        }
      })

      return data
    } catch (error) {
      log({ value: error, title: 'Chain: merge()', type: Log.error })
      throw error
    }
  }

  async fetch(key) {
    try {
      const { info, owner } = await this.instance.methods.getData(key).call()

      return {
        data: info ? JSON.parse(info || '{}') : info,
        owner: owner && owner.toLowerCase() !== ZERO_ADDRESS ? owner : '',
      }
    } catch (error) {
      log({ value: error, title: 'Chain: fetch()', type: Log.error })
      throw error
    }
  }

  async save({ key, data, owner, onHash = methodPlug, onReceipt = methodPlug }) {
    try {
      const { data: sourceData, owner: sourceOwner } = await this.fetch(key)

      const newData = this.merge({
        oldData: sourceData,
        newData: data,
      })

      return new Promise(async (resolve, reject) => {
        this.signerInstance.methods
          .setKeyData(key, {
            owner: sourceOwner || owner,
            info: JSON.stringify(newData),
          })
          .send({ from: sourceOwner || owner })
          .on('transactionHash', (hash: string) => {
            if (typeof onHash === 'function') onHash(hash)
          })
          .on('receipt', (receipt) => {
            if (typeof onReceipt === 'function') onReceipt(receipt)
          })
          .then(resolve)
          .catch(reject)
      })
    } catch (error) {
      log({ value: error, title: 'Chain: save()', type: Log.error })
      throw error
    }
  }

  async clear(key) {
    try {
      const { data, owner } = await this.fetch(key)

      if (!data || !owner) return false

      return new Promise(async (resolve, reject) => {
        await this.signerInstance.methods
          .setKeyData(key, {
            owner,
            info: '',
          })
          .send({
            from: owner,
          })
          .then(resolve)
          .catch(reject)
      })
    } catch (error) {
      log({ value: error, title: 'Chain: clear()', type: Log.error })
      throw error
    }
  }
}
