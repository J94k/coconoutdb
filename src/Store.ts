import { makeObservable, observable, action } from 'mobx'
import { log } from './utils'
import Chain, { Data, ChainInterface, ChainParams } from './Chain'

export interface StoreInterface {
  state: Data | null
  chain: ChainInterface | null
  newState: (state: Data | null) => void
  newChain: (params: ChainParams) => void
  get: (key: string) => any
  set: (key: string, value: any) => void
  delete: (key: string) => void
}

export default class Store implements StoreInterface {
  state: Data | null = null
  chain: ChainInterface | null = null

  constructor(
    params: ChainParams & {
      state: Data
    }
  ) {
    makeObservable(this, {
      state: observable,
      chain: observable,
      newState: action,
      newChain: action,
      set: action,
      delete: action,
    })
    this.newState(params.state)
    this.newChain(params)
  }

  newState(state) {
    try {
      this.state = state
    } catch (error) {
      throw error
    }
  }

  newChain(params) {
    try {
      this.chain = new Chain(params)
    } catch (error) {
      log({ title: 'Store: newChain()', value: error, color: 'red' })
      throw error
    }
  }

  get(key) {
    try {
      if (this.state) {
        return this.state[key]
      }
    } catch (error) {
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
}
