 const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

let painting = false;
let erasing = false;
let brushColor = document.getElementById('brushColor').value;
let brushSize = document.getElementById('brushSize').value;

// Start drawing
function startPosition(e) {
  painting = true;
  draw(e);
}

// Stop drawing
function endPosition() {
  painting = false;
  ctx.beginPath();
}

// Draw on canvas
function draw(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = erasing ? '#ffffff' : brushColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mouseout', endPosition);
canvas.addEventListener('mousemove', draw);

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
  ctx.fillStyle = document.getElementById('canvasColor').value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Toggle eraser
document.getElementById('eraser').addEventListener('click', () => {
  erasing = !erasing;
  document.getElementById('eraser').style.background = erasing ? '#e74c3c' : '';
});

// Brush color change
document.getElementById('brushColor').addEventListener('change', (e) => {
  brushColor = e.target.value;
  erasing = false; // switch back to draw mode
  document.getElementById('eraser').style.background = '';
});

// Brush size change
document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = e.target.value;
});

// Canvas color change (fills background without erasing existing art)
document.getElementById('canvasColor').addEventListener('change', (e) => {
  const color = e.target.value;

  // Save existing drawing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Restore drawing on top
  ctx.putImageData(imageData, 0, 0);
});

// Save screenshot
document.getElementById('save').addEventListener('click', () => {
  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'my-paint.png';
  link.click();
});