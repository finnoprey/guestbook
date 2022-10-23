import { FILTER_BLACKLIST, ALLOWED_LETTERS, ALLOWED_SYMBOLS } from '$env/static/private'

function similarity(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length

  let matrix = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(matrix[i][j - 1] + 1, 
          matrix[i - 1][j] + 1)
        )
      }
    }
  }

  return matrix[b.length][a.length]
};

function removeRepeatCharacters(text) {
  let characters = text.split('')
  let newText = ''
  let lastChar = ''
  characters.forEach(character => {
    if (character != lastChar) {
      newText += character
      lastChar = character
    }
  })
  return newText
}

function generateAllPossibleVariations(text) {
  let length = text.length
  let variations = []
  for (let begin = 0; begin < length; begin++) {
    let end = begin + 1
    while (end < length + 1) {
      variations.push(text.slice(begin, end))
      end++
    }
  }

  return variations
}

function containsBlacklistedWords(text) {
  let failed = false
  text.split(' ').forEach(word => {
    FILTER_BLACKLIST.split(',').forEach(blacklistedWord => {
      if (word == blacklistedWord) {
        failed = true
      }
      
      // There is no way as of current to properly check similarity.
      // This functionality has been removed for now.

      // let similarityScore = similarity(blacklistedWord, word)
      // if (similarityScore < 2) {
      //   console.log(similarityScore + ' to ' + blacklistedWord)
      //   failed = true
      // }
    })
  })
  return failed
}

function checkVariationsForBlacklistedWords(text) {
  let failed = false
  const variations = generateAllPossibleVariations(text)
  variations.forEach(variation => {
    if (containsBlacklistedWords(variation)) {
      failed = true
    }
  })
  return failed
}

function containsDisallowedSymbols(text) {
  let failed = false
  let allowed = ALLOWED_LETTERS.split('') + ALLOWED_SYMBOLS.split('')
  let characters = text.split('')

  characters.forEach(character => {
    if (!allowed.includes(character)) {
      failed = true
    }
  })

  return failed
}

function convertToRaw(text) {
  let rawText = text
    .toLowerCase()
    .replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('\'', '')
    .replaceAll('(', '')
    .replaceAll('.', '')
    .replaceAll(',', '')
    .replaceAll(':', '')
    .replaceAll(';', '')
    .replaceAll('!', '')
    .replaceAll('?', '')
    .replaceAll('=', '')

  return rawText
}

function filterText(text) {
  let reasons = []

  let processedTest = convertToRaw(text)
  processedTest = removeRepeatCharacters(processedTest)

  if (containsDisallowedSymbols(processedTest)) {
    reasons.push('Disallowed Symbols')
  }

  if (checkVariationsForBlacklistedWords(processedTest)) {
    reasons.push('Blacklisted Phrases')
  }
  
  if (reasons.length == 0) {
    return {
      text: text,
      result: true
    }
  } else {
    return {
      text: text,
      result: false,
      reasons: reasons
    }
  }
}

export default filterText