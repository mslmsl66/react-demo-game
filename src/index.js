import React from 'react';
import ReactDOM from 'react-dom';
import TempCalculator from './temperature';
import Test from './testChildren';
import _ from 'lodash';
import './index.css';

// 小方格
// 函数组件、纯函数，相比于class拥有更好的性能，但是没有生命周期以及state
function Square(props) {
  // 点击事件，并触发父组件的onClick
  let className = props.highLight ? props.highLight + ' square' : 'square';
  return (
    // 这个click是向上的，在game组件里
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// 九宫格
// class组件，继承自React.Component有生命周期
class Board extends React.Component {
  handleClick(i, j) {
    this.props.onClick(i, j);
    console.log('啊啊啊')
  }

  isNeedHighLight(i, j) {
    if (this.props.winLines) {
      // 结构 [{x:0,y:0}, {x:0, y:1}, {x:0, y:2}]
      return this.props.winLines.some(point => point.x === i && point.y === j);
    }
    return false;
  }

  renderSquare(i, j) {
    let squareClass = this.isNeedHighLight(i, j) ? 'square-highlight' : '';
    return (
      <Square
        highLight={squareClass}
        value={this.props.squares[i][j]}
        onClick={this.handleClick.bind(this, i, j)}
        key={i + '' + j}
        // 每一个Square里的Button被点击，这个prop onClick就会被触发
        // 经实验，这个onClick没有绑定事件，一定要Square组件里有onClick触发才会被执行
      />
    );
  }

  render() {
    let getSquares = () => {
      let squares = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          squares.push(this.renderSquare(i, j));
        }
      }
      return squares;
    };
    let squares = getSquares();
    return (
      <div className="board">
        {squares}
      </div>
    );
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

// 最外层
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: [[], [], []], // squares是一个 九宫格，初始化时是空的九宫格，游戏还没开始。后续执行一步，history就加一个九宫格
        newStep: {}
      }],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i, j) {
    // 每次click都会在history尾部加一个新的九宫格，这个新九宫格是上一步的复制，未来的一步就基于这个复制去更改
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // 从第0步浅拷贝到当前一步
    const current = history[history.length - 1]; // 默认取最后一个，如果是刚开始那就是空的九宫格，否则就是上一步的复制
    // const copy = current.squares.slice();
    const copy = _.cloneDeep(current.squares);
    if (copy[i][j] || calculateWinner(copy)) {
      // 已点击或已有赢家
      return;
    }
    copy[i][j] = this.state.xIsNext ? 'X' : 'O'; // 下棋
    this.setState({
      stepNumber: this.state.stepNumber + 1, // 每次点击，步骤+1
      history: history.concat([{
        squares: copy,
        newStep: new Point(i, j)
      }]), // 记录新加一个九宫格，当前步九宫格的复制。concat返回新的数组，不会更改原数组
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleDESC() {
    this.setState({
      isDesc: !this.state.isDesc
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // 拿当前的九宫格记录
    const winner = calculateWinner(current.squares);

    const moves = history.map((currentValue, index) => {
      let isThick = this.state.stepNumber === index;
      let fontClass = isThick ? 'step-weight' : '';
      const desc = index ?
        'Go to move #' + currentValue.newStep.toString() :
        'Go to game start';
      return (
        <li key={index}>
          <button
            onClick={() => this.jumpTo(index)}
            className={fontClass}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let steps = this.state.isDesc ? moves.reverse() : moves;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLines={winner ? winner.lines : []}
            onClick={(i, j) => this.handleClick(i, j)} // 由Square传到Board，传到Game
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.toggleDESC()}>切换升降序</button>
          <div>{status}</div>
          <ol>{steps}</ol>
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
    [{x:0,y:0}, {x:0, y:1}, {x:0, y:2}],
    [{x:1,y:0}, {x:1, y:1}, {x:1, y:2}],
    [{x:2,y:0}, {x:2, y:1}, {x:2, y:2}],
    [{x:0,y:0}, {x:1, y:0}, {x:2, y:0}],
    [{x:0,y:1}, {x:1, y:1}, {x:2, y:1}],
    [{x:0,y:2}, {x:1, y:2}, {x:2, y:2}],
    [{x:0,y:0}, {x:1, y:1}, {x:2, y:2}],
    [{x:2,y:0}, {x:1, y:1}, {x:0, y:2}],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [p1, p2, p3] = lines[i];
    // [[], [], []]
    if (squares[p1.x][p1.y] && squares[p1.x][p1.y] === squares[p2.x][p2.y] && squares[p1.x][p1.y] === squares[p3.x][p3.y]) {
      return {
        winner: squares[p1.x][p1.y],
        lines: lines[i]
      };
    }
  }
  return null;
}