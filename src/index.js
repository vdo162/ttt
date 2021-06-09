import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
	let winSquares = [];
	if(props.winSquares) {
		winSquares = props.winSquares;
	}
    return (
      <button 
		  className={winSquares.indexOf(props.index) !== -1 ? "square winSquares" : "square"} 
		  onClick = {props.onClick}
	  >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, winSquares) {
	  
    return (
	  <Square key={i}
		value={this.props.squares[i]} 
		winSquares={winSquares}
		index={i}
		onClick={() => this.props.onClick(i)} 
	  />
	);
  }

  render() {
	let square = [];
	let squares = [];
	for (let j = 0; j < 3; j++) {
		for (let i = 0; i < 3; i++) {
			square[i] = this.renderSquare(j*3+i, this.props.winSquares);
		}
		squares[j] = <div key={j}>{square.slice()}</div>
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
		  xIsNext: true,
		  sortDec: false,
		  highLightLast: {
			always: false,
			highLight: false			
		  }
	  };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
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
	this.setState({
		highLightLast: {
			always: this.state.highLightLast.always,
			highLight: false			
		}
	});
  }
  jumpTo(step){
	this.setState({
		  stepNumber: step,
		  xIsNext: (step%2) === 0
    });
	this.setState({
		highLightLast: {
			always: this.state.highLightLast.always,
			highLight: true			
		}
	});
  }
  render() {
	const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const noWinner = calculateNoWinner(current.squares);
	const moves = history.map((step, move) => {
      const col = step.position%3+1;		
      const row = Math.floor(step.position/3+1);		
      const desc = move ?
        `Перейти к ходу #${move} (${col}, ${row})` :
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={(this.state.highLightLast.always || this.state.highLightLast.highLight) && (move === this.state.stepNumber) ? 'btn active' : 'btn'}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner[0]) {
      status = 'Выиграл ' + winner[0];
    } else if(noWinner) {
	  status = 'Ничья';
	} else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
				squares={current.squares}
				winSquares={winner[1]}
				onClick = {(i) => this.handleClick(i)}
		  />
        </div>
        <div className="game-info">
		  <button onClick={() => this.setState({highLightLast: {always: !this.state.highLightLast.always}})} className='containerLight'>
			<div className='titleLight'>Включить подсветку последнего хода</div>
			<div className={this.state.highLightLast.always ? 'toggleLight on' : 'toggleLight'}>
				<div className={this.state.highLightLast.always ? 'toggleLightCircle on' : 'toggleLightCircle'}>
				</div>
			</div>
		  </button>
          <div>{status }</div>
		  <button onClick={() => this.setState({sortDec: !this.state.sortDec})} className='containerSort'>
			<div className='titleSort'>Сортировка</div>
			<div className={this.state.sortDec ? 'arrowSortLeft sort' : 'arrowSortLeft'}>
				<hr color='black' size='1'/>
			</div>
			<div className={this.state.sortDec ? 'arrowSortRight sort' : 'arrowSortRight'}>
				<hr color='black' size='1'/>
			</div>
		  </button>
		  
          <ol>{this.state.sortDec ? moves.slice().reverse() : moves}</ol>
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
			return [squares[a], lines[i]];
		}
	}
	return [null];
};

function calculateNoWinner (squares) {
	return squares.indexOf(null) === -1;
};
