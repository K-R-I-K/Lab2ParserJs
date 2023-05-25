const acorn = require('acorn');

const javascriptCode = "const numbers = [1, 2, 3, 4, 5];\n" +
    "let sum = 0;\n" +
    "\n" +
    "for (let i = 0; i < numbers.length; i++) {\n" +
    "  sum += numbers[i];\n" +
    "}\n" +
    "\n" +
    "console.log(\"The sum is: \" + sum);\n" +
    "\n" +
    "function multiplyByTwo(number) {\n" +
    "  return number * 2;\n" +
    "}\n" +
    "\n" +
    "const multipliedNumbers = numbers.map(multiplyByTwo);\n" +
    "console.log(\"Multiplied numbers: \" + multipliedNumbers);\n" +
    "\n" +
    "const filteredNumbers = numbers.filter((number) => number % 2 === 0);\n" +
    "console.log(\"Filtered numbers: \" + filteredNumbers);";

const ast = acorn.parse(javascriptCode, { ecmaVersion: 2020 });

const root = buildTree(ast, javascriptCode);

graphic(root, '');

function buildTree(node, code) {
    const type = node.type;
    const value = (type === 'Identifier' || type === 'Literal') ? code.slice(node.start, node.end) : null;
    const children = [];

    for (const key in node) {
        if (key !== 'type' && key !== 'start' && key !== 'end' && typeof node[key] === 'object' && node[key] !== null) {
            if (Array.isArray(node[key])) {
                for (const childNode of node[key]) {
                    children.push(buildTree(childNode, code));
                }
            } else {
                children.push(buildTree(node[key], code));
            }
        }
    }

    return { type, value, children };
}

function graphic(node, tab) {
    console.log(tab + node.type + (node.value ? ': ' + node.value : ''));
    for (const child of node.children) {
        graphic(child, tab + '  ');
    }
}