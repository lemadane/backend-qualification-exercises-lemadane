import { start } from "repl"

export type DowntimeLog = [start: Date, end: Date]

export type DowntimeLogList = DowntimeLog[]

export function merge(input: DowntimeLogList[]) {
  const flat = input.flat()
  const sorted = flat.sort((current, next) => {
    const [start, end] = current
    const [nextStart, nextEnd] = next
    return start.getTime() - nextStart.getTime()
  })
  for (let i = 0; i < sorted.length - 1; i++) {
    const [start, end] = sorted[i]
    const [nextStart, nextEnd] = sorted[i + 1]
    if (end.getTime() >= nextStart.getTime()) {
      sorted[i] = [start, nextEnd]
      sorted.splice(i + 1, 1) // remove next
      i--
    }
  }
  return sorted
}
