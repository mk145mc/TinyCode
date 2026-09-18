let pyodideReady = false;

async function init() {
  document.getElementById('output').textContent = '加载 Python 中...';
  await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
  }).then((py) => {
    window.pyodide = py;
    pyodideReady = true;
    document.getElementById('output').textContent = '✅ Python 已就绪';
  });
}

async function run() {
  if (!pyodideReady) {
    alert('Python 还在加载，请稍等...');
    return;
  }
  const code = document.getElementById('code').value;
  const output = document.getElementById('output');
  output.textContent = '运行中...';
  try {
    window.pyodide.runPython(code);
  } catch (e) {
    output.textContent = e;
  }
}

document.getElementById('run').addEventListener('click', run);
document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('output').textContent = '';
});

init();