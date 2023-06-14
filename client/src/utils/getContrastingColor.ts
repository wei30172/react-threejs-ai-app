const getContrastingColor = (color: string): string => {
  const hex = color.replace('#', '')

  // Parse the red, green, and blue values from the hex color
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate the brightness of the color using the weighted sum of the red, green, and blue values
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return "black" if the color is light, and "white" if the color is dark
  return brightness > 128 ? 'black' : 'white'
}

export default getContrastingColor