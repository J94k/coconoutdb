import { makeAutoObservable } from 'mobx'
import { log, Log } from './utils'
import { EVM_ADDRESS_REGEXP } from './constants'
import Chain, { Data, ChainInterface, ChainParams, JsonValue } from './Chain'

export interface StoreInterface {
  data: Data | null
  service: ChainInterface | null
  readonly dataKey: string
  readonly dataOwner: string
  error?: Error
  loading: boolean
  newData: (data: Data | null) => void
  newDataKey: (dataKey: string) => void
  newDataOwner: (address: string) => void
  newService: (params: ChainParams) => void
  set: (key: string, value: JsonValue) => void
  delete: (key: string) => void
  readFromService: (dataKey?: string) => void
  saveToService: () => void
}

export default class Store implements StoreInterface {
  data: Data | null = null
  service: ChainInterface | null = null
  dataKey = ''
  dataOwner = ''
  error
  loading = false

  constructor(
    params: ChainParams & {
      dataKey: string
      dataOwner: string
    }
  ) {
    const { dataKey, dataOwner } = params

    this.newDataKey(dataKey)
    this.newDataOwner(dataOwner)
    this.newService(params)

    makeAutoObservable(this)
  }

  newData(data) {
    this.data = data
  }

  newDataKey(dataKey) {
    this.dataKey = dataKey
  }

  newDataOwner(address) {
    if (typeof address === 'string' && !!address.match(EVM_ADDRESS_REGEXP)) {
      this.dataOwner = address
    } else {
      log({
        value: `Address ${address} is not in a EVM format. It is not saved`,
        title: 'Store: newDataOwner()',
        type: Log.warning,
      })
    }
  }

  newService(params) {
    try {
      this.service = new Chain(params)
    } catch (error) {
      log({ value: error, title: 'Store: newService()', type: Log.error })
      this.error = error
    }
  }

  set(key, value) {
    if (this.data) {
      this.data[key] = value
    }
  }

  delete(key) {
    if (this.data) {
      delete this.data[key]
    }
  }

  async readFromService(dataKey) {
    const { dataKey: initKey, service } = this

    if (!service) return

    this.loading = true

    await service
      .fetch(dataKey || initKey || '')
      .then(({ data, owner }) => {
        this.newData(data)
        this.newDataOwner(owner)
      })
      .catch((error) => {
        log({ value: error, title: 'Store: readFromService()', type: Log.error })
        this.error = error
      })

    this.loading = false
  }

  async saveToService() {
    const { data, dataKey, dataOwner, service } = this

    if (!service || !dataKey || !dataOwner || !data) return

    this.loading = true

    await service
      .save({
        data,
        key: dataKey,
        owner: dataOwner,
      })
      .catch((error) => {
        log({ value: error, title: 'Store: saveToService()', type: Log.error })
        this.error = error
      })

    this.loading = false
  }
}
