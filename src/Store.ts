import { makeAutoObservable } from 'mobx'
import { log, Log } from './utils'
import { EVM_ADDRESS_REGEXP } from './constants'
import Chain, { Data, ChainInterface, ChainParams } from './Chain'

export interface StoreInterface {
  data: Data | null
  service: ChainInterface | null
  readonly key: string | null
  readonly owner: string | null
  error: Error | null
  loading: boolean
  newData: (data?: Data) => void
  newKey: (key: string) => void
  newOwner: (address: string) => void
  newService: (params: ChainParams) => void
  set: (key: string, value: any) => void
  delete: (key: string) => void
  readFromService: (key?: string) => void
  saveToService: () => void
}

export default class Store implements StoreInterface {
  data: Data | null = null
  service: ChainInterface | null = null
  key = null
  owner = null
  error = null
  loading = false

  constructor(
    params: ChainParams & {
      key: string
      owner: string
    }
  ) {
    const { key, owner } = params

    this.newKey(key)
    this.newOwner(owner)
    this.newService(params)

    makeAutoObservable(this)
  }

  newData(data) {
    try {
      this.data = data
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

  newOwner(address) {
    try {
      if (!!address.match(EVM_ADDRESS_REGEXP)) {
        this.owner = address
      } else {
        log({
          value: `Address ${address} is not in a EVM format. It is not saved`,
          title: 'Store: newOwner()',
          type: Log.warning,
        })
      }
    } catch (error) {
      log({ value: error, title: 'Store: newOwner()', type: Log.error })
      throw error
    }
  }

  newService(params) {
    try {
      this.service = new Chain(params)
    } catch (error) {
      log({ value: error, title: 'Store: newService()', type: Log.error })
      throw error
    }
  }

  set(key, value) {
    try {
      if (this.data) {
        this.data[key] = value
      }
    } catch (error) {
      throw error
    }
  }

  delete(key) {
    try {
      if (this.data) {
        delete this.data[key]
      }
    } catch (error) {
      throw error
    }
  }

  async readFromService(key) {
    const { key: initKey, service } = this

    if (!service) return

    this.loading = true

    await service
      .fetch(key || initKey || '')
      .then(({ data, owner }) => {
        this.newData(data)
        this.newOwner(owner)
      })
      .catch((error) => {
        log({ value: error, title: 'Store: readFromService()', type: Log.error })
        this.error = error
      })

    this.loading = false
  }

  async saveToService() {
    const { data, key, owner, service } = this

    if (!service || !key || !owner || !data) return

    this.loading = true

    await service
      .save({
        key,
        data,
        owner: owner,
      })
      .catch((error) => {
        log({ value: error, title: 'Store: saveToService()', type: Log.error })
        this.error = error
      })

    this.loading = false
  }
}
