import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { IconToggle } from '@protonapp/react-native-material-ui'
import moment from 'moment'

// Code adapted from https://github.com/ReactNativeAcademy/Stopwatch
function Timer({ interval, style }) {
  const pad = n => (n < 10 ? '0' + n : n)
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={style.containerTimer}>
      <Text style={style.textTimer}>{pad(duration.minutes())}:</Text>
      <Text style={style.textTimer}>{pad(duration.seconds())}</Text>
      {style.showMsec ? (
        <Text style={style.textTimer}>.{pad(centiseconds)}</Text>
      ) : null}
    </View>
  )
}

function Lap({ interval, style, lapPrefix }) {
  const pad = n => (n < 10 ? '0' + n : n)
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={style.containerLap}>
      <Text style={style.lapStyle}>
        {lapPrefix} {pad(duration.minutes())}:
      </Text>
      <Text style={style.lapStyle}>{pad(duration.seconds())}</Text>
      {style.showMsec ? (
        <Text style={style.lapStyle}>.{pad(centiseconds)}</Text>
      ) : null}
    </View>
  )
}

class Stopwatch extends Component {
  state = {
    start: 0,
    now: 0,
    timePrevLap: 0,
    timeBeforePause: 0,
    lapTime: 0,
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  start = () => {
    const {
      startButton: { action },
    } = this.props
    const now = new Date().getTime()
    if (this.state.timeBeforePause == 0) {
      this.setState({
        start: now,
        now,
        timePrevLap: 0,
        timeBeforePause: 0,
        lapTime: 0,
      })
    } else {
      this.setState({
        start: now,
        now,
      })
    }
    if (action) action()
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() })
    }, 10)
  }

  pause = () => {
    clearInterval(this.timer)
    const {
      pauseButton: { action },
    } = this.props
    if (action) action()
    const { start, now, timeBeforePause } = this.state
    const timeBeforePauseNew = now - start + timeBeforePause
    this.setState({ timeBeforePause: timeBeforePauseNew, now: 0, start: 0 })
  }

  reset = () => {
    clearInterval(this.timer)
    const {
      resetButton: { action },
    } = this.props
    if (action) action()
    this.setState({
      start: 0,
      now: 0,
      timePrevLap: 0,
      timeBeforePause: 0,
      lapTime: 0,
    })
  }

  lap = () => {
    const { start, now, timePrevLap, timeBeforePause } = this.state
    let lapTime = now - start + timeBeforePause - timePrevLap
    let timePrevLapNew = now - start + timeBeforePause
    this.setState({ lapTime, timePrevLap: timePrevLapNew })
    const {
      lapButton: { action },
    } = this.props
    if (action) action()
  }

  render() {
    const {
      timeColor,
      fontSize,
      iconFullWidth,
      showMsec,
      startButton,
      pauseButton,
      resetButton,
      lapButton,
    } = this.props

    const { now, start, timeBeforePause } = this.state
    const time = now - start + timeBeforePause
    const styles = {
      wrapper: {},
      lapStyle: {
        fontSize: lapButton.lapTextSize,
        color: this.state.lapTime ? lapButton.lapColor : '#FFFFFF00',
      },
      containerTimer: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
      containerLap: {
        flexDirection: 'row',
      },
      textTimer: {
        fontSize,
        color: timeColor,
      },
      outerContainerIcon: {
        justifyContent: 'center',
        alignItems: iconFullWidth ? null : 'center',
      },
      containerIcon: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: iconFullWidth ? null : 140,
      },
      showMsec,
    }

    return (
      <View style={styles.wrapper}>
        <Lap
          interval={this.state.lapTime}
          style={styles}
          lapPrefix={lapButton.lapText}
        />
        <Timer interval={time} style={styles} />
        <View style={styles.outerContainerIcon}>
          <View style={styles.containerIcon}>
            <IconToggle
              name={resetButton.iconName}
              color={resetButton.color}
              size={24}
              onPress={this.reset}
            />
            {this.state.start ? (
              <IconToggle
                name={pauseButton.iconName}
                color={pauseButton.color}
                size={24}
                onPress={this.pause}
              />
            ) : (
              <IconToggle
                name={startButton.iconName}
                color={startButton.color}
                size={24}
                onPress={this.start}
              />
            )}
            <IconToggle
              name={lapButton.iconName}
              color={lapButton.enabled ? lapButton.color : '#FFFFFF00'}
              size={24}
              onPress={lapButton.enabled ? this.lap : null}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default Stopwatch
