import React from 'react'
import './App.css'
import bomb from './bomb.svg'
let [ROWS, COLS, BOMBS] = [3,3,1] // Ideally should come from configuration

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function getBombs(m, n, x) {
  return Array(x)
    .fill(0)
    .map((_item) => {
      return getRandomInt(m * n)
    })
}

function createBoard(m, n, x) {
  let _bombs = getBombs(m, n, x)
  let board = new Array(m)
  for (let i = 0; i < m; i++) {
    board[i] = new Array(n).fill(0)
    for (let j = 0; j < n; j++) {
      board[i][j] = {
        id: `${i}_${j}`,
        isBomb: _bombs.includes(i * n + j),
        visible: false,
      }
    }
  }
  return board
}

export default function App() {
  let board = React.useState(createBoard(ROWS, COLS, BOMBS))
  return (
    <div className='App'>
      <h1 className='main-title'>Mine Sweeper</h1>
      <MineSweeper board={board} />
    </div>
  )
}

function MineSweeper({ board }) {
  let [_board, setBoardState] = board
  let [isOver, setIsOver] = React.useState(false)

  let handleClick = (_i, _j, _cell) => {
    if (_cell.isBomb) {
      let newBoard = _board.map((r, i) => {
        return r.map((cell, j) => {
          if (cell.isBomb) {
            return { ...cell, visible: true }
          } else {
            return cell
          }
        })
      })
      setBoardState(newBoard)
      setIsOver(true)
    } else {
      let newBoard = _board.map((r, i) => {
        return r.map((cell, j) => {
          if (_i === i && _j === j) {
            return { ...cell, visible: true }
          } else {
            return cell
          }
        })
      })
      setBoardState(newBoard)
    }
  }

  function countSurroundingBombs(i, j, board) {
    // for cell (i, j): -> (i-1, j-1),    (i-1, j), (i-1, j+1)
    // -> (i, j-1),      (item)     (i, j+1)
    // -> (i + 1, j-1), (i+1, j), (i+1, j+1)
    // all within bounds, check bounds,
    // i-1 >= 0, i+1 < rows.length, j - 1 >= 0 , j+1 < cols.length;
    let rows = board.length
    let cols = board[0].length
    let count = 0

    if (i - 1 >= 0 && j - 1 >= 0) {
      if (board[i - 1][j - 1].isBomb) count++
    }
    if (i - 1 >= 0) {
      if (board[i - 1][j].isBomb) count++
    }
    if (i - 1 >= 0 && j + 1 < cols) {
      if (board[i - 1][j + 1].isBomb) count++
    }
    if (j - 1 >= 0) {
      if (board[i][j - 1].isBomb) count++
    }
    if (j + 1 < cols) {
      if (board[i][j + 1].isBomb) count++
    }
    if (i + 1 < rows && j - 1 >= 0) {
      if (board[i + 1][j - 1].isBomb) count++
    }
    if (i + 1 < rows) {
      if (board[i + 1][j].isBomb) count++
    }
    if (i + 1 < rows && j + 1 < cols) {
      if (board[i + 1][j + 1].isBomb) count++
    }

    return count
  }

  function getClass(cell, count, isOver) {

    if (cell.visible) {
      if (cell.isBomb) {
        if (isOver) {
          return 'cell-bomb cell-disabled'
        }
        return 'cell-bomb'
      }
      if (count === 0) {
        if (isOver) {
          return 'cell-blank cell-disabled'
        }
        return 'cell-blank'
      } else {
        if (isOver) {
          return 'cell cell-disabled'
        }
        return 'cell'
      }
    } else {
      if (isOver) {
        return 'cell cell-disabled'
      }
      return 'cell'
    }
  }

  function getWinningStatus(board) {
    let rows = board
    let cols = rows[0]
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        let cell = board[i][j]
        if ((!cell.isBomb && !cell.visible) || (cell.visible && cell.isBomb)) {
          return false
        }
      }
    }
    return true
  }

  let isDisabled = isOver || getWinningStatus(_board)
  return (
    <>
       <h1 className='title'>{isOver &&'GAME OVER'} {getWinningStatus(_board) && <span className='green'>YOU WON</span>}</h1>
      <div className='minecontainer'>
        <div className='minesweeper'>
          {_board.map((row, i) => {
            let _row = row.map((cell, j) => {
              let count = countSurroundingBombs(i, j, _board)
              return (
                <div className={getClass(cell, count, isDisabled)} onClick={() => handleClick(i, j, cell)} key={cell.id}>
                  {cell.visible ? (
                    cell.isBomb ? (
                      <img src={bomb} alt='bomb' className='bomb' />
                    ) : count === 0 ? (
                      ' '
                    ) : (
                      <span className='count'>{count}</span>
                    )
                  ) : (
                    ' '
                  )}
                </div>
              )
            })
            return (
              <div className='cellContainer' key={i}>
                {_row}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
