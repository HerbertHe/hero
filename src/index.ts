import { IOptions } from "./types";

export class Hero {
	private _opitons: IOptions = {
		dev: false,
		persist: false,
	}

	constructor(options: IOptions) {
		this._opitons = {
			...this._opitons,
			...options,
		}
	}

	/**
	 * 持久化
	 */
	private _presist = () => {
		const { persist } = this._opitons
	}

	/**
	 *
	 * @param fn 原函数
	 */
	wrapper = (fn: Function) => {
		try {
			fn()
		} catch(e) {
			// TODO 捕获错误处理
		}
	}

	// TODO 支持手动处理流程
}