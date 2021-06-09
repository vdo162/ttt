import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    return (
      <button 
		  className="square" 
		  onClick = {props.onClick}
	  >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
	  <Square key={i}
		value={this.props.squares[i]} 
		onClick={() => this.props.onClick(i)} 
	  />
	);
  }

  render() {
	let square = [];
	let squares = [];
	for (let j = 0; j < 3; j++) {
		for (let i = 0; i < 3; i++) {
			square[i] = this.renderSquare(j*3+i);
		}
		squares[j] = <div>{square.slice()}</div>
	}
    return (
      <div>
		{squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
	  super(props);
	  this.state = {
		  history: [{
			squares: Array(9).fill(null),
			step: null
		  }],
		  stepNumber: 0,
		  xIsNext: true
	  };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
		position: i
      }]),
	  stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  jumpTo(step){
	  this.setState({
		  stepNumber: step,
		  xIsNext: (step%2) === 0
    });
  }
  render() {
	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
	const moves = history.map((step, move) => {
      const col = step.position%3+1;		
      const row = Math.floor(step.position/3+1);		
      const desc = move ?
        `Перейти к ходу #${move} (${col}, ${row})` :
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber ? 'btn active' : 'btn'}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Выиграл ' + winner;
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
				squares={current.squares} 
				onClick = {(i) => this.handleClick(i)}
		  />
        </div>
        <div className="game-info">
          <div>{status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

let render = () => {
	ReactDOM.render(
	  <Game />,
	  document.getElementById('root')
	);
}
render();

function calculateWinner (squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6], 
		[1, 4, 7], 
		[2, 5, 8], 
		[0, 4, 8], 
		[2, 4, 6] 
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
};
