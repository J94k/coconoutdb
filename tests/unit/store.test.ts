import Store, { StoreInterface } from '../../src/Store'
import { ZERO_ADDRESS } from '../../src/constants'

describe('Store', () => {
  let store: StoreInterface

  beforeAll(() => {
    store = new Store({
      state: {
        foo: 1,
        bar: 2,
        kek: 3,
        pek: 4,
        users: ['Bob', 'Alice', 'BobaAlice'],
      },
      key: 'example.com',
      ownerAddress: ZERO_ADDRESS,
    })
  })

  it('should update keys values', () => {
    expect(store.state?.foo).toBe(1)
    expect(store.state?.kek).toBe(3)
    expect(store.state?.users).toStrictEqual(['Bob', 'Alice', 'BobaAlice'])

    store.set('foo', { foo: 1 })
    store.set('kek', 0)
    store.set('users', [...store.state?.users, 'CataDogaBird'])

    expect(store.state?.foo).toStrictEqual({ foo: 1 })
    expect(store.state?.kek).toBe(0)
    expect(store.state?.users).toStrictEqual(['Bob', 'Alice', 'BobaAlice', 'CataDogaBird'])
  })

  it('should delete keys', () => {
    expect(store.state?.foo).toStrictEqual({ foo: 1 })
    expect(store.state?.kek).toBe(0)

    store.delete('foo')
    store.delete('kek')

    expect(store.state?.foo).toBe(undefined)
    expect(store.state?.kek).toBe(undefined)
  })

  it('should update saving parameters', () => {
    expect(store.key).toBe('example.com')
    expect(store.ownerAddress).toBe(ZERO_ADDRESS)

    store.newKey('different.com')
    store.newOwnerAddress('0x8ee296e2f81c9172d90210a6eb01234bd169d29a')

    expect(store.key).toBe('different.com')
    expect(store.ownerAddress).toBe('0x8ee296e2f81c9172d90210a6eb01234bd169d29a')
  })
})
