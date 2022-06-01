import { makeObservable, observable, action } from 'mobx'
import { log, Log } from './utils'
import { EVM_ADDRESS_REGEXP } from './constants'
import Chain, { Data, ChainInterface, ChainParams } from './Chain'

export interface StoreInterface {
  state: Data | null
  chain: ChainInterface | null
  readonly key: string | null
  readonly ownerAddress: string | null
  newState: (state?: Data) => void
  newKey: (key: string) => void
  newOwnerAddress: (address: string) => void
  newChain: (params: ChainParams) => void
  set: (key: string, value: any) => void
  delete: (key: string) => void
  save: () => Promise<any>
}

export default class Store implements StoreInterface {
  state: Data | null = null
  chain: ChainInterface | null = null
  key = null
  ownerAddress = null

  constructor(
    params: ChainParams & {
      state: Data
      key: string
      ownerAddress: string
    }
  ) {
    const { state, key, ownerAddress } = params

    this.newState(state)
    this.newKey(key)
    this.newOwnerAddress(ownerAddress)
    this.newChain(params)

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
      const { state, key, ownerAddress, chain } = this

      if (!chain || !key || !ownerAddress || !state) return

      return chain.save({
        key,
        owner: ownerAddress,
        data: state,
      })
    } catch (error) {
      log({ value: error, title: 'Store: save()', type: Log.error })
      throw error
    }
  }
}
