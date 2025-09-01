const colors = [
  '#FFADAD',
  '#FFD6A5',
  '#FDFFB6',
  '#CAFFBF',
  '#9BF6FF',
  '#A0C4FF',
  '#BDB2FF',
  '#FFC6FF',
  '#FFFFFC',
  '#D0F4DE',
  '#FFDEB4',
  '#C3F8FF',
  '#A3C9A8',
  '#FFB5A7',
  '#FFDAC1',
  '#B5EAD7',
  '#E2F0CB',
  '#C7CEEA',
  '#FFABAB',
  '#FFC3A0',
  '#FF677D',
  '#D4A5A5',
  '#392F5A',
  '#31A2AC',
  '#61C0BF',
  '#6B4226',
  '#D9BF77',
  '#ACD8AA',
  '#FFE156',
  '#6A0572',
  '#AB83A1',
  '#78CAD2',
  '#FCF5C7',
  '#F4A259',
  '#8CBEB2',
  '#F67280',
  '#C06C84',
  '#6C5B7B',
  '#355C7D',
  '#99B898',
]

function getRandomColor() {
  const index = Math.floor(Math.random() * colors.length)
  return colors[index]
}

export { getRandomColor }
