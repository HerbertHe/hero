import { ILog } from "./types"

export const loadLocalStorage = <T>() => {
	const local = localStorage.getItem("hero-log-data")
	if (!!local) {
		return JSON.parse(local) as ILog<T>
	}
	return null
}

export const storeToLocalStorage = <T>(log: ILog<T>) => {
	localStorage.setItem("hero-log-data", JSON.stringify(log))
}

export const freeLocalStorage = () => {
	localStorage.removeItem("hero-log-data")
}