import { freeLocalStorage, loadLocalStorage, storeToLocalStorage } from "./browser"
import { uploadToRemote } from "./remote"
import { IError, ILog, IOptions } from "./types"
import { getHash, isBrowser } from "./utils"

export class Hero<T> {
	private _opitons: IOptions<T> = {
		dev: false,
		persist: false,
	}

	private _errs: IError<T>[] = []
	private _local: ILog<T> | null = null

	constructor(options: IOptions<T>) {
		this._opitons = {
			...this._opitons,
			...options,
		}

		if (isBrowser) {
			const local = loadLocalStorage<T>()
			if (!!local) {
				this._local = local
				const { errors } = local
				if (!!errors && errors.length > 0) {
					this._errs = [...errors]
				}
			}
		} else {
			// TODO nodejs 端数据存储合并
		}
	}

	/**
	 * 释放本地存储
	 */
	private _free = () => {
		if (isBrowser) {
			freeLocalStorage()
		} else {
			// TODO 释放服务端持久化存储
		}
	}

	/**
	 * 持久化存储触发
	 */
	presist = () => {
		const { persist } = this._opitons
		if (persist) {
			const log: ILog<T> = {
				errors: this._errs,
				latest: Date.now(),
			}

			const h = getHash(JSON.stringify(log.errors))

			log.hash = h

			if (!!this._local) {
				const { hash } = this._local
				if (!!hash && h !== hash) {
					if (isBrowser) {
						storeToLocalStorage<T>(log)
					} else {
						// TODO 更新 nodejs 存储
					}
				}
			}
		}
	}

	/**
	 * 上传日志，轮询自动上传
	 */
	// TODO 轮询上传日志
	private _upload = async () => {
		const { remote } = this._opitons
		const local = loadLocalStorage<T>()
		if (!!remote && !!remote.url && !!local) {
			const { url, fetch } = remote
			await uploadToRemote(url, local, () => {
				// 释放本地存储
				this._free()
			}, this, fetch)
		}
	}

	/**
	 *
	 * @param fn 原函数
	 */
	wrapper = async (fn: Function) => {
		try {
			await fn()
		} catch (e) {
			if (e instanceof Error) {
				this._errs.push({
					type: "functional",
					error: e,
					update: Date.now(),
				})
			} else {
				// 自定义错误类型捕获
				this._errs.push(e)
			}
		}
	}

	// TODO 支持手动处理流程
}