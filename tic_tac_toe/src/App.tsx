import './App.css'
import React from 'react'

// tic-tac-toe game in react typescript

// types and interfaces


// Type for Square Component
type squareProps = { value: 'X' | 'O' | null; onClick: any; isMatched: boolean }
// line mean any three combination of squares (whether vertical or horizontal or diagonal)
type line = [a: number, b: number, c: number]


// [
// 'O', null, 'X',
// 'X', 'X', 'O',
// 'O', null, null,
// ]
type squares = ('X' | 'O' | null)[]

// Board Component State type declaration
type BoardState = {
  squares: squares;
  xIsNext: boolean;
}
// Board Component Props type declaration
type BoardProps = { squares: squares; onClick?: any; line: line | undefined }

// Game Component State Type declaration
interface GameState {
  history: {
    squares: squares;
  }[];
  xIsNext: boolean;
  stepNumber: number;
}


///////////////////////////////////////////////////

// I added match class which is triggered when any winner is declared to highlight the square
function Square(props: squareProps) {
  return (
    <button
      className={`square ${props.isMatched ? 'match' : " "}`}
      onClick={props.onClick}>

      {props.value}
    </button>
  );
}



class Board extends React.Component<BoardProps, BoardState> {

  // - i is the number of square. Its value is hard coded below in the return block
  renderSquare(i: number) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}

      isMatched={this.props.line?.includes(i) ? true : false}

    />;
  }
  render() {
    return (
      <div>

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// About History
// history is list of all previous states of boards 
// It is like this 


// history = [
// Before first move
//   {
//     squares: [
//       null, null, null,
//       null, null, null,
//       null, null, null,
//     ]
//   },
//   // After first move
//   {
//     squares: [
//       null, null, null,
//       null, 'X', null,
//       null, null, null,
//     ]
//   },
//   // After second move
//   {
//     squares: [
//       null, null, null,
//       null, 'X', null,
//       null, null, 'O',
//     ]
//   },
//   // ...
// ]

class Game extends React.Component<{}, GameState> {
  constructor(props: BoardProps) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }



  handleClick(i: number) {


    // making copy for all the squares
    // making copy of all history starting from 0 to last step number .Stepnumber can be altered when we click on move wala button. it is changed from this.state.history.slice() to this 
    const history = this.state.history.slice(0, this.state.stepNumber + 1)

    // state of last board
    const current = history[history.length - 1]

    // making copy of it 
    let squares = Array.from(current.squares);


    // checking if winner is declared or i have double clicked on a single square
    if (calculateWinner(squares) || squares[i]) { return }


    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      // add the board in the history list
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,

    })

  }
  jumpsTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0

    })
  }
  render() {
    const history = this.state.history

    // when a user click on any button list from history ,it trigger `jumpsTo` function which changes the stepnumber to that step (or that button number or index whatever)
    // then current state is now history's that step

    const current = history[this.state.stepNumber]

    const winner = calculateWinner(current.squares)

    // move == index 
    const moves = history.map((_, move) => {
      const desc = move ?
        'Go to move no ' + move :
        'Go to game start'
      return (
        <li key={move}><button onClick={() => this.jumpsTo(move)}>{desc}</button></li>
      )
    })


    let status;
    if (winner) {
      status = 'Winner: ' + winner.value;

    } else {
      status = 'Next Turn: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <div>{status}</div>
          <Board squares={current.squares} onClick={(i: number) => this.handleClick(i)} line={winner?.line} />
        </div>
        <div className="game-info">
          <h3>History</h3>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// this function not only calculate winner but also if winner is true give the square number of that line
function calculateWinner(squares: squares): { value: ('X' | 'O' | null), line: line } | null {
  const lines: line[] = [
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
      return { value: squares[a], line: [a, b, c] }
    }
  }
  return null;
}
export default Game
