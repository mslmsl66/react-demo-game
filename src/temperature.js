import React from 'react';
const type = {
  'c': 'C',
  'f': 'F'
}

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}

class Temperature extends React.Component {
  handleChange(e) {
    this.props.onTempChange(e.target.value);
  }

  render() {
    let inputValue = this.props.inputValue;
    let myType = this.props.type;
    return (
      <div>
        <label>
          i'm {type[myType]} !!!
        </label>
        <input
          value={inputValue}
          onChange={this.handleChange.bind(this)}
        >
        </input>
      </div>
    );
  }
}

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: '',
      scale: 'c'
    }
  }

  handleCChange(newVal) {
    this.setState({scale: 'c', temp: newVal});
  }

  handleFChange(newVal) {
    this.setState({scale: 'f', temp: newVal});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temp;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <Temperature
          type="c"
          inputValue={celsius}
          onTempChange={this.handleCChange.bind(this)}
        />
        <Temperature
          type="f"
          inputValue={fahrenheit}
          onTempChange={this.handleFChange.bind(this)}
        />
        <BoilingVerdict
          celsius={parseFloat(celsius)}
        />
      </div>
    );
  }
}