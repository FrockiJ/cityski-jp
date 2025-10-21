#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 配置
const srcDir = path.join(__dirname, 'src');
const indexPath = path.join(srcDir, 'index.ts');

// 需要忽略的文件和目錄
const ignorePatterns = [
  'index.ts',
  '*.test.ts',
  '*.spec.ts',
  '*.d.ts',
  '__tests__',
  'node_modules'
];

function shouldIgnore(filePath) {
  const fileName = path.basename(filePath);
  return ignorePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(fileName);
    }
    return fileName === pattern || filePath.includes(pattern);
  });
}

function getAllTsFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !shouldIgnore(entry.name)) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !shouldIgnore(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function generateExportPath(filePath) {
  // 將絕對路徑轉換為相對於 src 的路徑
  const relativePath = path.relative(srcDir, filePath);
  // 移除 .ts 擴展名
  const withoutExt = relativePath.replace(/\.ts$/, '');
  // 確保使用 Unix 風格的路徑分隔符
  const normalizedPath = withoutExt.replace(/\\/g, '/');
  
  return `export * from "./${normalizedPath}"`;
}

function generateIndex() {
  console.log('🔄 Generating exports...');
  
  try {
    const tsFiles = getAllTsFiles(srcDir);
    const exports = tsFiles
      .map(generateExportPath)
      .sort()
      .join('\n');
    
    const content = exports + '\n';
    
    // 檢查是否有變化
    let hasChanged = true;
    if (fs.existsSync(indexPath)) {
      const existingContent = fs.readFileSync(indexPath, 'utf8');
      hasChanged = existingContent !== content;
    }
    
    if (hasChanged) {
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log(`✅ Generated ${tsFiles.length} exports in index.ts`);
    } else {
      console.log('✅ Not generating export file as there were no changes.');
    }
    
  } catch (error) {
    console.error('❌ Error generating exports:', error.message);
    process.exit(1);
  }
}

// 執行
generateIndex();