import Chain, { ChainInterface } from '../../src/Chain'

const CHAINS = {
  RINKEBY: {
    id: 4,
    storage: '0xd2baDd65d97549EB8af9B83BcD74768c9ebaeC31',
    rpc: 'https://rinkeby.infura.io/v3/fc55ddb25b694fef8e2363f6b6c9341f',
  },
}

describe('Chain', () => {
  const STORAGE_KEY = 'c9e8a2a07de94a90257107a00d9cb631bac'
  const STORAGE_OWNER = '0x4086a2CAe8d3FcCd94D1172006516C7d0794C7Ee'
  const STORAGE_DATA = {
    title: 'Test title',
    amount: 42,
    content: [1, 2, 3],
  }
  let chain: ChainInterface

  beforeAll(() => {
    const {
      RINKEBY: { storage, rpc },
    } = CHAINS

    chain = new Chain({
      rpc,
      provider: rpc,
      address: storage,
    })
  })

  it('should merge data', () => {
    try {
      const data = chain.merge({
        oldData: {
          foo: 0,
          bar: {
            a: 0,
            c: {
              d: 0,
            },
            e: 3,
          },
        },
        newData: {
          title: 'title',
          foo: 1,
          bar: {
            a: 1,
            b: 2,
            c: {
              d: 1,
              e: 1,
            },
          },
        },
      })

      expect(data).toStrictEqual({
        title: 'title',
        foo: 1,
        bar: {
          a: 1,
          b: 2,
          e: 3,
          c: {
            d: 1,
            e: 1,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  })

  it('should fetch data', async () => {
    try {
      const { data, owner } = await chain.fetch(STORAGE_KEY)

      expect(owner).toBe(STORAGE_OWNER)
      expect(data).toStrictEqual(STORAGE_DATA)
    } catch (error) {
      console.error(error)
    }
  })
})
