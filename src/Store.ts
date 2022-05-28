import { makeAutoObservable, makeObservable, observable, action, flow } from 'mobx'
import { log } from './utils'
import Chain, { Data, ChainInterface } from './Chain'

export interface StoreInterface {
  state: Data
  chain: ChainInterface
  newChain: (params: { address: string; rpc: string; library: any }) => void
  get: () => any
  set: () => void
  delete: () => void
}

export default class Store implements StoreInterface {
  state
  chain

  constructor(params) {
    makeObservable(this, {
      state: observable,
      chain: observable,
      newChain: action,
      set: action,
      delete: action,
    })
    this.chain = this.newChain(params)
  }

  newChain(params) {
    try {
      this.chain = new Chain(params)
    } catch (error) {
      log({ title: 'Store: newChain()', value: error, color: 'red' })
      throw error
    }
  }

  get() {}

  set() {}

  delete() {}
}
