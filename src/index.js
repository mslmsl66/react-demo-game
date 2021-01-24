import React from 'react';
import ReactDOM from 'react-dom';
import TempCalculator from './temperature';
import Test from './testChildren';
import './index.css';

// 小方格
// 函数组件、纯函数，相比于class拥有更好的性能，但是没有生命周期以及state
function Square(props) {
  // 点击事件，并触发父组件的onClick
  return (
    // 这个click是向上的，在game组件里
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// 九宫格
// class组件，继承自React.Component有生命周期
class Board extends React.Component {
  handleClick(i) {
    this.props.onClick(i);
    console.log('啊啊啊')
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={this.handleClick.bind(this, i)}
        key={i}
        // 每一个Square里的Button被点击，这个prop onClick就会被触发
        // 经实验，这个onClick没有绑定事件，一定要Square组件里有onClick触发才会被执行
      />
    );
  }

  render() {
    let getList = (arr) => {
      return arr.map(item => {
        return this.renderSquare(item);
      })
    };
    return (
      <div>
        <div className="board-row">
          {getList([0,1,2])}
        </div>
        <div className="board-row">
          {getList([3,4,5])}
        </div>
        <div className="board-row">
          {getList([6,7,8])}
        </div>
      </div>
    );
  }
}

// 最外层
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: new Array(9) // squares是一个 九宫格，初始化时是空的九宫格，游戏还没开始。后续执行一步，history就加一个九宫格
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }


  handleClick(i) {
    // 每次click都会在history尾部加一个新的九宫格，这个新九宫格是上一步的复制，未来的一步就基于这个复制去更改
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 从第0步浅拷贝到当前一步
    const current = history[history.length - 1]; // 默认取最后一个，如果是刚开始那就是空的九宫格，否则就是上一步的复制
    const copy = current.squares.slice();
    if (copy[i] || calculateWinner(copy)) {
      // 已经有赢家或已点击
      return;
    }
    copy[i] = this.state.xIsNext ? 'X' : 'O'; // 下棋
    this.setState({
      stepNumber: this.state.stepNumber + 1, // 每次点击，步骤+1
      history: history.concat([{squares: copy}]), // 记录新加一个九宫格，当前步九宫格的复制。concat返回新的数组，不会更改原数组
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // 拿当前的九宫格记录
    const winner = calculateWinner(current.squares);

    const moves = history.map((currentValue, index) => {
      const desc = index ?
        'Go to move #' + index :
        'Go to game start';
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} // 由Square传到Board，传到Game
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <div>
    <Game />
    <TempCalculator />
    <Test />
  </div>,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}