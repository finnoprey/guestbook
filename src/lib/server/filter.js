import { FILTER_BLACKLIST, ALLOWED_LETTERS, ALLOWED_SYMBOLS } from '$env/static/private'

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

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
  for (let a = 0; a < length; a++) {
    // a = 0
    let b = a + 1
    while (b < length + 1) {
      variations.push(text.slice(a, b))
      b++
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
      let similarityScore = similarity(blacklistedWord, word)
      if (similarityScore > 0.8) {
        failed = true
      }
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

  if (containsDisallowedSymbols(processedTest)) {
    reasons.push('DAS: disallowed symbols')
  }

  processedTest = convertToRaw(processedTest)
  processedTest = removeRepeatCharacters(processedTest)

  if (checkVariationsForBlacklistedWords(processedTest)) {
    reasons.push('BLV: blacklisted words')
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