export type SlideType = "text" | "image" | "blank"
export interface BreezeSlide {
    type: SlideType,
}
export interface BreezeTextSlide extends BreezeSlide {
    type: "text",
    text: string,
    lines: number,
}
export interface BreezeImageSlide extends BreezeSlide {
    type: "image",
    src: string,
}
export interface BreezeConfig {
    fg: string,
    bg: string,
    fonts: string[],
}
export interface BreezePresentation {
    slides: BreezeSlide[],
    config: BreezeConfig,
}

function mapSlide(slideText: string): BreezeSlide {
    const emptyMatch = new RegExp(/(\\+(?:\r\n|\r|\n)?)+$/);
    const imgMatch = new RegExp(/^@(.+)(?:$|\r\n|\r|\n)/);
    return emptyMatch.test(slideText)
      ? { type: "blank" }
      : imgMatch.test(slideText)
        ? {
            type: "image",
            src: slideText.match(imgMatch)?.[0].replace("@", "").trim(),
          } as BreezeImageSlide
        : {
            type: "text",
            text: slideText,
            lines: (slideText.match(/\n/g) || []).length + 1,
          } as BreezeTextSlide;
}

function parseConfig(matches: RegExpMatchArray[]): BreezeConfig {
    const config: BreezeConfig = {
        fg: "#ffffff",
        bg: "#000000",
        fonts: [] as string[],
    };
    for (const match of matches) {
        const [, key, value] = match;
        if (key === "font") {
        config.fonts.push(value);
        } else if (key == "fg" || key == "bg") {
        config[key] = value;
        }
    }
    config.fonts = config.fonts.concat(["Roboto", "Helvetica"]);
    return config;
}

function parseFile(text: string): BreezePresentation {
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
        .map((slide) => slide.replace(/^(?:\r\n|\r|\n)|(?:\r\n|\r|\n)$/g, ""))
        // parse out image slides
        .map(mapSlide);
    return {
        config,
        slides,
    };
}

export default parseFile;