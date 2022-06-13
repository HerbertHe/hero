import { $fetch } from "ohmyfetch"
import { Hero } from "."
import { CustomFetchType, IError, ILog } from "./types"

// TODO 支持自定义 fetch 函数
export const uploadToRemote = async <T>(url: string, data: ILog<T>, success: () => void, ctx: Hero<T>, f?: CustomFetchType<T>) => {
	// if (!!f) {
	// 	const { } = await f(data)
	// 	return
	// }

	await $fetch(url, {
		"method": "POST",
		"body": JSON.stringify(data),
		async onRequestError({ request, error }) {
			// TODO 请求错误轮询
			ctx.wrapper(() => {
				throw ({
					type: "network",
					error,
					update: Date.now(),
					info: {
						request
					},
				}) as IError<T>
			})
		},
		async onResponseError({ request, response, error }) {
			ctx.wrapper(() => {
				throw ({
					type: "network",
					error,
					update: Date.now(),
					info: {
						request,
						response
					},
				}) as IError<T>
			})
		},

		async onResponse() {
			success()
		}
	})
}