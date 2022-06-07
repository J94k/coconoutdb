export {}

declare global {
  interface AnyObject<T = any> {
    [key: string]: T
  }

  interface EthereumProvider extends AnyObject {}

  interface Window extends AnyObject {
    ethereum: EthereumProvider
  }
}
