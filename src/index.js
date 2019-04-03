import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Accelerometer } from 'expo'
import debounce from 'lodash.debounce'

class Shake extends Component {
  componentDidMount = () => {
    Accelerometer.setUpdateInterval(50)
    this.listener = Accelerometer.addListener(data => {
      try {
        if (this.lastData) {
          const diff = data.x - this.lastData.x
          if (diff > 1) {
            this.shakeCount += 1
            if (this.shakeCount > 3) {
              this.onShake()
            }
            this.clearShakeCount()
          }
        }
        this.lastData = data
      } catch (error) {
        console.error(error)
      }
    })
  }

  componentWillUnmount = () => {
    if (this.listener) this.listener.remove()
  }

  onShake = debounce(() => {
    const { onShake } = this.props

    if (onShake) onShake()

    this.shakeCount = 0
  }, 200)

  clearShakeCount = debounce(() => {
    this.shakeCount = 0
  }, 400)

  shakeCount = 0
  listener = null
  lastData = null

  render() {
    return <Fragment>{this.props.children}</Fragment>
  }
}

Shake.propTypes = {
  children: PropTypes.node.isRequired,
  onShake: PropTypes.func.isRequired,
}

export default Shake
