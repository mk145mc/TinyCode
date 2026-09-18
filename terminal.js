let pyodideReady = false;

async function init() {
  const output = document.getElementById('output');
  output.textContent = '加载 Python 中...';
  try {
    window.pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });
    pyodideReady = true;
    output.textContent = '✅ Python 已就绪';
  } catch (err) {
    output.textContent = '❌ 加载失败: ' + err.message;
  }
}

async function run() {
  if (!pyodideReady) {
    alert('Python 还在加载，请稍等...');
    return;
  }
  const code = document.getElementById('code').value;
  const output = document.getElementById('output');
  output.textContent = '运行中...';

  // 重定向 stdout/stderr 到内存，这样能抓到 print 的内容
  window.pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

  try {
    await window.pyodide.runPythonAsync(code);
    const stdout = window.pyodide.runPython('sys.stdout.getvalue()');
    const stderr = window.pyodide.runPython('sys.stderr.getvalue()');
    const result = (stdout || '') + (stderr || '');
    output.textContent = result || '(执行完成，无输出)';
  } catch (e) {
    output.textContent = '❌ 错误:\n' + e;
  }
}

document.getElementById('run').addEventListener('click', run);
document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('output').textContent = '';
});

init();
