// TODO: remove it! =========
declare var window: any
declare var ethereum: any
// ==========================

export type Wallet = {
  chainId: number
  activeAccount: string
}

export const connectMetamask = async (): Promise<Wallet | undefined> => {
  try {
    if (!window?.ethereum?.isMetaMask) return

    if (!ethereum.isConnected()) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    }

    return {
      chainId: Number(ethereum.networkVersion),
      activeAccount: ethereum.selectedAddress,
    }
  } catch (error) {
    console.error(error)
  }
}
