import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserBabel from 'prettier/parser-babel';
import parserPostcss from 'prettier/parser-postcss';

// 格式化代码
export function prettierCode(code: string) {
  try {
    // 参数1：代码字符串，参数2：格式化配置
    return prettier.format(code, {
      plugins: [parserHtml, parserBabel, parserPostcss],
      // 允许vue脚本
      vueIndentScriptAndStyle: true,
    });
  } catch (error) {
    // 如果格式化失败,返回源码
    return code;
  }
}

// 生成唯一的ID
export function generateUniqueId() {
  const timestamp = new Date().getTime().toString();
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0'); // 生成4位随机数
  const uniqueId = timestamp + randomNum;
  return uniqueId;
}
