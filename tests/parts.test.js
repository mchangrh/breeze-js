const parseFile = require('../src/breeze.js');

test("parses config correctly", () => {
    const expected = {
        fg: '#aabbcc',
        bg: '#cbaa',
        fonts: [ 'Hellvetica', 'Roboto', 'Helvetica' ]
    }
    const text = `
#.fg:#aabbcc
#.bg:#cbaa
#.font:Hellvetica
`
    expect(parseFile(text).config).toEqual(expected);
})

test("parses single text block correctly", () => {
    const expected = [{
        type: 'text',
        text: 'Hello, world!',
        lines: 1
    }]
    const text = 'Hello, world!'
    expect(parseFile(text).slides).toEqual(expected);
})

test("parses multiple text blocks correctly", () => {
    const expected = [{
        type: 'text',
        text: 'Hello, world!',
        lines: 1
    }, {
        type: 'text',
        text: 'Goodnight,\nworld!',
        lines: 2
    }]
    const text = `
Hello, world!

Goodnight,
world!`
    expect(parseFile(text).slides).toEqual(expected);
})

test("ignores multiple lines", () => {
    const expected = [{
        type: 'text',
        text: 'Lorem',
        lines: 1
    }, {
        type: 'text',
        text: 'Ipsum',
        lines: 1
    }, {
        type: 'text',
        text: 'Set',
        lines: 1
    }]
    const text = `
Lorem



Ipsum

Set`
    expect(parseFile(text).slides).toEqual(expected);
})

test("produces empty slide", () => {
    const expected = [{
        type: 'text',
        text: 'Lorem',
        lines: 1
    }, {
        type: 'blank'
    }, {
        type: 'text',
        text: 'Ipsum',
        lines: 1
    }]
    const text = `
Lorem

\\
\\

Ipsum
`
    expect(parseFile(text).slides).toEqual(expected);
})

test("escape with backslashes", () => {
    const expected = [{
        type: 'text',
        text: '\\@not_actually_an_image.png',
        lines: 1
    }, {
        type: 'text',
        text: '\\#not_actually_a_comment',
        lines: 1
    }]
    const text = `
\\@not_actually_an_image.png

\\#not_actually_a_comment
`
    expect(parseFile(text).slides).toEqual(expected);
})

test("parse image link", () => {
    const expected = [{
        type: 'image',
        src: 'https://example.com/image.png',
    }, {
        type: 'image',
        src: "./image.jpg"
    }]
    const text = `
@https://example.com/image.png

@./image.jpg
`
    expect(parseFile(text).slides).toEqual(expected);
})

test("ignores comments", () => {
    const expected = [{
        type: 'text',
        text: 'not a comment',
        lines: 1
    }]
    const text = `
# comment

# another
# multiline
#comment

not a comment
`
    expect(parseFile(text).slides).toEqual(expected);
})