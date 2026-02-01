import { Action } from "./action.interface"

export type ActionFactory<T = void> = (...args: any[]) => Action<T>
