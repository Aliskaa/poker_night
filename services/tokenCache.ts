import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import log from './logger';

interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
}

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          log.info(`${key} was used 🔐 \n`)
        } else {
          log.warn('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        log.error('secure store get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    saveToken: (key: string, token: string) => {
      return SecureStore.setItemAsync(key, token)
    },
  }
}

// SecureStore ne fonctionne pas sur le web, on gère l'exception
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined