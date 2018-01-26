/* global MicroCanvas WIDTH HEIGHT */
'use strict'
const INITIAL_TAIL_SIZE = 5
const INITIAL_APPLE_COUNT = 6
const INITIAL_BLOCK_SIZE = 6

// Initialize game information
let direction = 0
let speed = 0
let velocityX = 0
let velocityY = 0
let playerX = 0
let playerY = 0
let tailSize = 0
let trailX = new Array(32)
let trailY = new Array(32)
let appleCount = 0
let appleX = new Array(12)
let appleY = new Array(12)
let blockSize = 0

let game = new MicroCanvas()

function getHorizontalTileCount () {
  return WIDTH / blockSize
}

function getVerticalTileCount () {
  return HEIGHT / blockSize
}

function randomX () {
  return game.random(0, getHorizontalTileCount())
}

function randomY () {
  return game.random(0, getVerticalTileCount())
}

game.setup(() => {
  direction = 0
  speed = 3
  velocityX = 0
  velocityY = 0
  playerX = randomX()
  playerY = randomY()
  tailSize = INITIAL_TAIL_SIZE
  appleCount = INITIAL_APPLE_COUNT
  blockSize = INITIAL_BLOCK_SIZE

  let X = randomX()
  for (let i = 0; i < trailX.length; i++) {
    trailX[i] = X + i
  }

  let Y = randomY()
  for (let i = 0; i < trailY.length; i++) {
    trailY[i] = Y + i
  }

  for (let i = 0; i < appleX.length; i++) {
    appleX[i] = randomX()
  }

  for (let i = 0; i < appleY.length; i++) {
    appleY[i] = randomY()
  }
})

game.loop(() => {
  if (game.buttonPressed('left') && direction != 2) {
    direction = 1
    velocityX = -1
    velocityY = 0
  }

  if (game.buttonPressed('right') && direction != 1) {
    direction = 2
    velocityX = 1
    velocityY = 0
  }

  if (game.buttonPressed('up') && direction != 4) {
    direction = 3
    velocityX = 0
    velocityY = -1
  }

  if (game.buttonPressed('down') && direction != 3) {
    direction = 4
    velocityX = 0
    velocityY = 1
  }

  if (game.frameCount % speed > 0) {
    return
  }

  game.clear()

  // Update state
  playerX += velocityX
  playerY += velocityY
  if (playerX < 0) {
    playerX = getHorizontalTileCount() - 1
  }
  if (playerX > getHorizontalTileCount() - 1) {
    playerX = 0
  }
  if (playerY < 0) {
    playerY = getVerticalTileCount() - 1
  }
  if (playerY > getVerticalTileCount() - 1) {
    playerY = 0
  }

  // Draw player trail
  for (let i = 0; i < tailSize; i++) {
    const x = trailX[i]
    const y = trailY[i]
    game.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)

    // Reset tailSize size if player eats themselves
    if (x === playerX && y === playerY) {
      game.reset()
    }
  }

  // Shift snake tail
  for (let i = 0; i < tailSize - 1; i++) {
    trailX[i] = trailX[i + 1]
  }
  trailX[tailSize - 1] = playerX

  for (let i = 0; i < tailSize - 1; i++) {
    trailY[i] = trailY[i + 1]
  }
  trailY[tailSize - 1] = playerY

  for (let i = 0; i < appleCount; i++) {
    let x = appleX[i]
    let y = appleY[i]

    // Check if player ate apple
    if (playerX === x && playerY === y) {
      // Increase tail size
      tailSize++

      trailX[tailSize - 1] = playerX
      trailY[tailSize - 1] = playerY

      // Create new apple at position
      appleX[i] = randomX()
      appleY[i] = randomY()

      // Reduce apple count
      if (tailSize == 16) {
        appleCount = 1
      } else if (tailSize == 12) {
        speed = 1
        blockSize = 4
        appleCount = 2
      } else if (tailSize == 8) {
        speed = 2
        blockSize = 5
        appleCount = 4
      }
    }

    // Draw apple
    game.fillRect(appleX[i] * blockSize, appleY[i] * blockSize, blockSize - 1, blockSize - 1)
  }
})
