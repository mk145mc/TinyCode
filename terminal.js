let pyodide = null;

async function init() {
  const output = document.getElementById('output');
  output.textContent = '加载 Python 中...';
  try {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });
    output.textContent = '✅ Python 已就绪';
  } catch (err) {
    output.textContent = '❌ 加载失败: ' + err.message;
  }
}

function run() {
  if (!pyodide) {
    alert('Python 还在加载，请稍等...');
    return;
  }
  const code = document.getElementById('code').value;
  const output = document.getElementById('output');
  output.textContent = '运行中...';

  try {
    // 每次运行前重新重定向 stdout/stderr
    pyodide.runPython('import sys, io; sys.stdout = io.StringIO(); sys.stderr = io.StringIO()');
    
    // 同步执行用户代码
    pyodide.runPython(code);
    
    // 取出输出
    const stdout = pyodide.runPython('sys.stdout.getvalue()');
    const stderr = pyodide.runPython('sys.stderr.getvalue()');
    
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
