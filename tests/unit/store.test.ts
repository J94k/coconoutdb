import Store, { StoreInterface } from '../../src/Store'

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
})
