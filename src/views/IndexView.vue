<template>
  <div class="min-h-screen bg-gray-100 flex flex-wrap justify-center p-2">
    <div class="w-full">
      <div v-if="winner" class="winner">Winner: {{ winner }}</div>
      <div v-else-if="isDraw" class="draw">It's a draw!</div>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div
          v-for="(cell, index) in board"
          :key="index"
          class="card-bg w-32 h-32 flex items-center justify-center text-2xl select-none"
          :class="currentPlayer === 'X' ? 'x-cursor' : 'o-cursor'"
          @click="handleCellClick(index)"
      >
        <div class="w-24 h-24" v-if="cell === 'X'"><img src="@/assets/icons/x.svg"></div>
        <div class="w-24 h-24" v-if="cell === 'O'"><img src="@/assets/icons/o.svg"></div>
      </div>
    </div>
    <div class="w-full mt-4 flex space-x-2">
      <button @click="startGame('player')" class="bg-blue-500 text-white p-2 rounded">
        Play with friend
      </button>
      <button @click="startGame('computer')" class="bg-green-500 text-white p-2 rounded">
        Play with computer
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, nextTick} from 'vue';

const board = ref<Array<string | null>>(Array(9).fill(null));
const currentPlayer = ref<string>('X');
const winner = ref<string | null>(null);
const gameMode = ref<string | null>(null);

const isDraw = computed(() => board.value.every(cell => cell !== null));

const checkWinner = (): string | null => {
  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let conditions of winConditions) {
    const [a, b, c] = conditions;
    if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) {
      return board.value[a];
    }
  }
  return null;
};

const makeComputerMove = () => {
  let move = generateComputerMoveIndex();
  if (move !== -1) {
    board.value[move] = 'O';
  }
};

const generateComputerMoveIndex = (): number => {
  const emptyIndices = board.value
      .map((value, index) => (value === null ? index : null))
      .filter(value => value !== null);

  if (emptyIndices.length === 0) {
    return -1; // Board is full
  }

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex] as number;
};

const handleCellClick = (index: number) => {
  if (!board.value[index] && !winner.value) {
    board.value[index] = currentPlayer.value;
    winner.value = checkWinner();

    if (winner.value || isDraw.value) {
      return;
    }

    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';

    if (gameMode.value === 'computer' && currentPlayer.value === 'O') {
      nextTick(() => {
        makeComputerMove();
        winner.value = checkWinner();
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
      });
    }
  }
};

const startGame = (mode: string) => {
  gameMode.value = mode;
  board.value.fill(null);
  currentPlayer.value = 'X';
  winner.value = null;
};

function createHandWrittenXSymbol(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;

  // Set the line width and color.
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';

  // Begin a new path and move the cursor to the top-left corner.
  ctx.beginPath();
  ctx.moveTo(0, 0);

  // Draw a line to the bottom-right corner.
  ctx.lineTo(canvas.width, canvas.height);

  // Draw another line from the top-right corner to the bottom-left corner.
  ctx.lineTo(canvas.width, 0);

  // End the path and stroke it to draw the X symbol.
  ctx.closePath();
  ctx.stroke();
}

function createHandWrittenOSymbol(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;

  // Set the line width and color.
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';

  // Begin a new path and move the cursor to the center of the canvas.
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2);

  // Draw a circle with a radius of half the canvas's width.
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);

  // End the path and stroke it to draw the O symbol.
  ctx.closePath();
  ctx.stroke();
}

</script>

<style>


.winner {
  margin-bottom: 10px;
}

.draw {
  margin-bottom: 10px;
}

.card-bg {
  background: url("@/assets/icons/square.svg") round;
}
.o-cursor {
  cursor: url("@/assets/icons/o-cursor.png"), auto !important;
}
.x-cursor {
  cursor: url("@/assets/icons/x-cursor.png"), auto !important;
}
</style>
