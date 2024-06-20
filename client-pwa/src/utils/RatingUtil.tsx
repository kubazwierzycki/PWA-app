import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";

/**
 * Function assigning a color on scale from red to green for rating [0, 10]
 * @param {number} rating - rating from [0,10] (float)
 * @returns {string} color rgb format: #rrggbb
 */
export function getRatingColor(rating: number) {
    // Ensure rating is within the expected range
    rating = Math.max(0, Math.min(10, rating));

    // Convert rating from [0, 10] to [0, 1]
    let normalizedRating = rating / 10;

    // Calculate red, green, and blue components
    let red, green;
    if (normalizedRating < 0.5) {
        // Scale from red to yellow for ratings from 0.0 to 0.5
        red = 255;
        green = normalizedRating * 2 * 255;
    } else {
        // Scale from yellow to green for ratings from 0.5 to 1.0
        red = (1 - normalizedRating) * 2 * 255;
        green = 255;
    }

    // Convert to integer values
    red = Math.round(red);
    green = Math.round(green);

    // Convert to hexadecimal
    let redHex = red.toString(16).padStart(2, '0');
    let greenHex = green.toString(16).padStart(2, '0');

    // Return the color code
    return "#" + redHex + greenHex + "00";
}


export const renderStar = (rating: number, color: string) => {
    const style = {color: color};
    if (rating <= 5.0) {
        return (
            <StarOutlineIcon style={style}/>
        )
    }
    else if (rating > 5.0 && rating < 8.0) {
        return (
            <StarHalfIcon style={style} />
        )
    }
    else {
        return (
            <StarIcon style={style}/>
        )
    }
}

