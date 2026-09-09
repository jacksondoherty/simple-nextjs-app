// Cold pod wakes at dawn —
// the diff panel holds my work,
// three lines, nothing more.

export const haiku = [
  'Cold pod wakes at dawn —',
  'the diff panel holds my work,',
  'three lines, nothing more.',
]

if (haiku.length !== 3) {
  throw new Error(`a haiku has three lines, found ${haiku.length}`)
}
