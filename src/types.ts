export type reportInputEntry = {
  description: string
  dur: number
  client: string
  project: string
}

export type reportInputData = {
  total_count: number
  total_grand: number
  data: reportInputEntry[]
}

export type projectObject = {
  project: string
  duration: string
  descriptions: string
}

export type entriesObject = {
  client: string
  projects: projectObject[]
}

export type reportDataObject = {
  duration: string
  entries: entriesObject[]
}
