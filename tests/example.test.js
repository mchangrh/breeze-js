const fs = require('fs');
const file = fs.readFileSync('tests/example.sent', 'utf8');

const parseFile = require('../src/breeze.js');

// big test case
test("parses example.sent correctly", () => {
    const expected = {
        config: {
          fg: '#ffffff',
          bg: '#000000',
          fonts: [ 'Roboto', 'Helvetica' ]
        },
        slides: [
          { type: 'text', text: 'breeze-js', lines: 1 },
          {
            type: 'text',
            text: 'Origins:\n- breeze\n- sent\n- Takahashi Method',
            lines: 4
          },
          {
            type: 'text',
            text: 'Why?\n' +
              '- PowerPoint is a mess\n' +
              '- sent only supports Linux\n' +
              '- breeze only supports Linux and Windows',
            lines: 4
          },
          { type: 'text', text: 'Images are simple:', lines: 1 },
          { type: 'image', src: 'logo.png' },
          {
            type: 'text',
            text: 'The text-based sent format:\n' +
              '- Keeps the focus on the content;\n' +
              '- Can be edited with any tool;\n' +
              '- And is easy to share',
            lines: 4
          },
          {
            type: 'text',
            text: 'Benefits over breeze:\n' +
              '- It runs in browser;\n' +
              '- Basic styling is possible\n' +
              '  in the presentation file',
            lines: 4
          },
          {
            type: 'text',
            text: 'What you see is what you get:\n' +
              'The text is displayed exactly as you typed it;\n' +
              'No wrapping is done automatically',
            lines: 3
          },
          { type: 'text', text: 'Usage:\ntbd', lines: 2 },
          {
            type: 'text',
            text: '- One slide per paragraph;\n' +
              '- Lines starting with # are ignored;\n' +
              '- Image slide: paragraph containing @FILENAME\n' +
              '- Empty slide: just use a \\ as a paragraph',
            lines: 4
          },
          { type: 'blank' },
          {
            type: 'text',
            text: '\\@this_line_actually_started_with_a_\\.png\n' +
              '\\#This line as well\n' +
              'Prepend a backslash to kill behaviour of special characters',
            lines: 3
          },
          {
            type: 'text',
            text: 'Presentation styling:\n' +
              '- Configuration options from breeze\n' +
              '- All configuration options are comments\n' +
              '  that start with a dot: #.\n' +
              "- Because they're comments, they're\n" +
              '  backwards-compatible with sent',
            lines: 6
          },
          {
            type: 'text',
            text: '- Font: #.font:Noto Sans\n' +
              '- Foreground colour: #.fg:#000000\n' +
              '- Background colour: #.bg:#ffffff',
            lines: 3
          },
          {
            type: 'text',
            text: 'If multiple fonts are specified, the\nfirst one that is found is used',
            lines: 2
          },
          { type: 'text', text: 'Thank you.', lines: 1 }
        ]
    }
    expect(parseFile(file)).toEqual(expected);
})