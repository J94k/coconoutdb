import { configure, makeObservable, observable, action, flow } from 'mobx'
import { log } from './utils'
import Chain, { Data, ChainInterface } from './Chain'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
})

export interface StoreInterface {
  state: Data
  chain: ChainInterface
  newChain: (params: { address: string; rpc: string; library: any }) => void
  get: (key: string) => any
  set: (key: string, value: any) => void
  delete: (key: string) => void
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

  get(key) {
    try {
      return this.state[key]
    } catch (error) {
      throw error
    }
  }

  set(key, value) {
    try {
      this.state[key] = value
    } catch (error) {
      throw error
    }
  }

  delete(key) {
    try {
      delete this.state[key]
    } catch (error) {
      throw error
    }
  }
}
