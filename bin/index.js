const axios = require('axios').default

/**
 * Convert Milliseconds to hh:mm
 * 
 * @param {Number} duration in milliseconds
 */
const ms2Time = (duration) => {
  let minutes = parseInt((duration/(1000*60))%60)
  let hours = parseInt((duration/(1000*60*60))%24)

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes

  return hours + ":" + minutes
}

/**
 * Group object by given prop
 * 
 * @param {String} key 
 */
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})

/**
 * Group Toggl Summary
 * 
 * @param {Object} details - API response data
 */
  const groupDetails = (details) => {
  const byClient = groupBy('client')(details.data)
  
  const grouped = {
    total: ms2Time(details.total_grand)
  }

  for (const [ key, value ] of Object.entries(byClient)) {
    let projects = groupBy('project')(value)
    
    for (const [ _key, _value ] of Object.entries(projects)) {
      let desc = []
      let duration = 0
      projects[_key] = _value.reduce((values, value) => {
        if (value.description) {
          desc.push(value.description)
        }
        duration += value.dur
      
        return {
          description: desc,
          time: ms2Time(duration)
        }
      }, {})
    }

    grouped[key] = projects
  }

  return grouped
}

/**
 * Render report
 * 
 * @param {Object} data 
 * @param {String} date 
 */
const render = (data, date) => {
  const groupedDetails = groupDetails(data)
  
  console.log('\n-------------------------')
  console.log(`Toggl Summary: ${date}`)
  console.log('-------------------------')
  console.log(`\nTotal: ${groupedDetails.total}`)
  delete groupedDetails.total

  for (const [ key, value ] of Object.entries(groupedDetails)) {
    for (const [ _key, _value ] of Object.entries(value)) {
      const client = key !== 'null' ? `${key} › ` : ''
      console.log(`\n${client}${_key} (${_value.time})`)
      if (_value.description.length) {
        console.log('- ' + _value.description.join('\n- '))
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Setup + render
// -----------------------------------------------------------------------------

const apiToken = ''
const apiUserAgent = ''
const workspaceId = 0

const date = new Date().toISOString().slice(0,10) // '2020-09-25'

const url = 'https://api.track.toggl.com/reports/api/v2/details'
const options = {
  auth: {
    username: apiToken,
    password: 'api_token'
  },
  params: {
    since: date,
    until: date,
    user_agent: apiUserAgent,
    workspace_id: workspaceId
  }
}

axios.get(url, options).then(
  (response) => {
    render(response.data, date)
  },
  (error) => {
    throw Error(error)
  }
)
