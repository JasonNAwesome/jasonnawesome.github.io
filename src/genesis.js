import './style.css';
import React from 'react';
import ReactDOM from 'react-dom';

/*
function component() {
  const element = document.createElement('div');
  element.classList.add('yea');

  return element;
}

document.body.appendChild(component());
*/

/*
function tick() {
  const element = (
    <div>
      <h1>BASTARD-CLOCK</h1>
      <h2>{new Date().toLocaleTimeString()}</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
*/

/*ReactDOM.render(
  <h1 className='yea'>Ass</h1>,
  document.getElementById('root')
);*/

function Toptext() {return <h1>AND 1 AND 1 AND 1</h1>}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  // Special lifecycle methods
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {clearInterval(this.timerID);}

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h2>{this.state.date.toLocaleTimeString()}</h2>
      </div>
    )
  }
}

function App() {
  return(
    <div>
      <Toptext />
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);