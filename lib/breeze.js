function mapSlide(slideText) {
    const emptyMatch = new RegExp(/(\\+(?:\r\n|\r|\n)?)+$/);
    const imgMatch = new RegExp(/^@(.+)(?:$|\r\n|\r|\n)/);
    return emptyMatch.test(slideText)
      ? { type: "blank" }
      : imgMatch.test(slideText)
        ? {
            type: "image",
            src: slideText.match(imgMatch)?.[0].replace("@", "").trim(),
          }
        : {
            type: "text",
            text: slideText,
            lines: (slideText.match(/\n/g) || []).length + 1,
          };
}

function parseConfig(matches) {
    let config = {
        fg: "#ffffff",
        bg: "#000000",
        fonts: [],
    };
    for (const match of matches) {
        const [, key, value] = match;
        if (key === "font") config.fonts.push(value);
        else if (key == "fg") config.fg = value;
        else if (key == "bg") config.bg = value;
    }
    config.fonts = [...new Set([...config.fonts, "Roboto", "Helvetica"])];
    return config;
}

function parseFile(text) {
    // parse out configuration options
    const config = parseConfig([...text.matchAll(/^#\.(\w+):(.+)/gm)]);
    // split into slides
    const slides = text
        // split on double newlines
        .split(/(?:\r\n|\r|\n){2,}/)
        // remove comment lines
        .map((slide) => slide.replaceAll(/^#.+(?:\r\n|\r|\n|$)/gm, ""))
        // remove empty newlines
        .filter((slide) => !new RegExp(/^(?:\r\n|\r|\n$)+$|^$/).test(slide))
        // remove leading and trailing newlines
        .map((slide) => slide.replace(/(^(?:\r\n|\r|\n)+)|((?:\r\n|\r|\n|)+$)/g, ""))
        // parse out image slides
        .map(mapSlide)
    return {
        config,
        slides,
    };
}

if (typeof exports === "object") module.exports = parseFile;