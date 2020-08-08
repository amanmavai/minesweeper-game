import React from 'react'
import { MineSweeper } from './MineSweeper'
import './App.css'
let [ROWS, COLS, BOMBS] = [5, 5, 5] // Ideally should come from configuration

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
