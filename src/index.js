import 'regenerator-runtime/runtime'
import { Component } from 'react'

const initialState = {
  pending: false,
  resolved: false,
  rejected: false,
  value: null,
  error: null
}

class Track extends Component {
  state = initialState

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  triggerPromise = async (...args) => {
    const { promise } = this.props
    const isMounted = this.mounted

    isMounted &&
      this.setState({
        ...initialState,
        pending: true
      })

    try {
      const value = await promise(...args)
      isMounted &&
        this.setState({
          ...initialState,
          value,
          resolved: true
        })
    } catch (error) {
      isMounted &&
        this.setState({
          ...initialState,
          error,
          rejected: true
        })
    }
  }

  render() {
    const { render, children, promise } = this.props
    const callback = render || children
    if (typeof callback !== 'function') {
      throw Error('Props `render` or `children` must be a function.')
    }
    if (!promise instanceof Promise) {
      throw Error('The prop `promise` is required.')
    }

    return callback(this.triggerPromise, this.state)
  }
}

export default Track
