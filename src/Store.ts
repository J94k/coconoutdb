import { makeObservable, observable, action } from 'mobx'
import { log, Log } from './utils'
import { EVM_ADDRESS_REGEXP } from './constants'
import Chain, { Data, ChainInterface, ChainParams } from './Chain'

export interface StoreInterface {
  state?: Data
  chain?: ChainInterface
  readonly key?: string
  readonly ownerAddress?: string
  newState: (state?: Data) => void
  newKey: (key: string) => void
  newOwnerAddress: (address: string) => void
  newChain: (params: ChainParams) => void
  set: (key: string, value: any) => void
  delete: (key: string) => void
  save: () => Promise<any>
}

export default class Store implements StoreInterface {
  state
  chain
  key
  ownerAddress

  constructor(
    params: ChainParams & {
      state: Data
      key: string
      ownerAddress: string
    }
  ) {
    makeObservable(this, {
      state: observable,
      chain: observable,
      key: observable,
      ownerAddress: observable,
      newState: action,
      newKey: action,
      newOwnerAddress: action,
      newChain: action,
      set: action,
      delete: action,
    })

    const { state, key, ownerAddress } = params

    this.newState(state)
    this.newKey(key)
    this.newOwnerAddress(ownerAddress)
    this.newChain(params)
  }

  newState(state) {
    try {
      this.state = state
    } catch (error) {
      throw error
    }
  }

  newKey(key) {
    try {
      this.key = key
    } catch (error) {
      log({ value: error, title: 'Store: newKey()', type: Log.error })
      throw error
    }
  }

  newOwnerAddress(address) {
    try {
      if (!!address.match(EVM_ADDRESS_REGEXP)) {
        this.ownerAddress = address
      } else {
        log({
          value: 'Address is not in a EVM format. It is not saved',
          title: 'Store: newOwnerAddress()',
          type: Log.warning,
        })
      }
    } catch (error) {
      log({ value: error, title: 'Store: newOwnerAddress()', type: Log.error })
      throw error
    }
  }

  newChain(params) {
    try {
      this.chain = new Chain(params)
    } catch (error) {
      log({ value: error, title: 'Store: newChain()', type: Log.error })
      throw error
    }
  }

  set(key, value) {
    try {
      if (this.state) {
        this.state[key] = value
      }
    } catch (error) {
      throw error
    }
  }

  delete(key) {
    try {
      if (this.state) {
        delete this.state[key]
      }
    } catch (error) {
      throw error
    }
  }

  async save() {
    try {
      const { key, ownerAddress } = this

      if (!key || !ownerAddress) return

      return this.chain.save({
        key,
        owner: ownerAddress,
        data: this.state,
      })
    } catch (error) {
      log({ value: error, title: 'Store: save()', type: Log.error })
      throw error
    }
  }
}
