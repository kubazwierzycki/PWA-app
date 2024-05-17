/**
 * Function swapping or removing unrecognised char entities from text
 * @param {string} description - initial
 * @returns {string} corrected text
 */
export function clearCharEntities(description: string): string {
    const entityRegex = /&.*?;/g;
    const matches = description.match(entityRegex) || [];

    matches.forEach(entity => {
        switch (entity) {
            case "&#10;":
                // swap for newline
                description = description.replace(entity, "\n");
                break;
            case "&mdash;":
                // swap for long dash
                description = description.replace(entity, "\u2014");
                break;
            case "&#9;":
                // swap for tab
                description = description.replace(entity, "\t");
                break;
            default:
                // remove other
                description = description.replace(entity, "");
                break;
        }
    });

    return description;
}

/**
 * Function shortening text for brief description, based on both number of words and sentences
 * @param {string} description - text for shorten
 * @return {string} shorter text description
 */
export function getShortDescription(description: string): string {

    let i = 0;
    let words = 0;
    let sentences = 0;

    for (const char of description) {
        if (char === " ") {
            words++;
        }
        else if (char === "." || char === "!") {
            sentences++;
            if ((sentences >= 3 && words > 30) || sentences >= 4)
                return i !== description.length ? description.slice(0, i + 1) : description;
        }
        i++;
    }

    return description;
}
