const { Notebook } = require('crossnote');
const dotenv = require('dotenv');
const fs = require('fs');

const path = dotenv.config({ path: `.env.local`, override: true }).parsed.NOTEBOOK ?? dotenv.config().parsed.NOTEBOOK;

const files = ['Tasks.md','Theory.md'];

async function main() {
  const notebook = await Notebook.init({
    notebookPath: path,
    config: {
      previewTheme: 'github-light.css',
      mathRenderingOption: 'KaTeX',
      codeBlockTheme: 'github.css',
      printBackground: true,
      enableScriptExecution: true,
    },
  });
  
  if(!fs.existsSync('output')){
    fs.mkdirSync('output');
  }

  for (const note of files) {
    await notebook.getNoteMarkdownEngine(note).chromeExport({ fileType: 'pdf', runAllCodeChunks: true });
    const pdfPath = `output/${note.replace('.md', '.pdf')}`;
    fs.renameSync(`${path}/${note.replace('.md', '.pdf')}`, pdfPath);
  }
  
  return process.exit();
}

main();