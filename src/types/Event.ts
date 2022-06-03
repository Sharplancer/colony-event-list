type Event = {
  eventType: string,
  logTime: number,
  values: {
    [key: string]: any
  }
}

export default Event;