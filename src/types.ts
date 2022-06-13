import { $Fetch } from "ohmyfetch"

export interface IOptions<T extends any = any> {
	dev?: boolean        // 开发模式
	persist: boolean     // 开启持久化存储
	remote?: IRemote     // 开启远程日志记录
	log?: ILog<T>        // 开启日志记录
}

// 本地日志内容
export interface ILog<T> {
	errors: IError<T>[]  // 错误队列
	hash?: string         // 日志hash
	latest: number       // 最后更新时间
}

export interface IRemote {
	fetch?: $Fetch
}

export type ErrorType<T extends any> = "network" | "functional" | T

// TODO 支持自定义错误结构生成
export interface IError<T extends any = any> {
	type: ErrorType<T>  // 错误类型
	error: Error        // 错误对象
	update: number      // 错误更新时间
	info?: Record<string, string>  // 错误更多补充信息
}