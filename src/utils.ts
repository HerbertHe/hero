import { sm3 } from "sm-crypto"

/**
 * 判断浏览器环境
 */
export const isBrowser = typeof window !== 'undefined'

export const getHash = (str: string) => {
	return sm3(str)
}