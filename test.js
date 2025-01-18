const verbosity = document.getElementById("verbosity");
const acronym = document.getElementById("acronym");
const revAcronym = document.getElementById("revAcronym");
const metaScorer = document.getElementById("metaScorer");
const quippy = document.getElementById("quippy");

//Previews
const vsResponse = document.getElementById("vsResponse");
const vsWordCount = document.getElementById("vsWordCount");

const blResponse = document.getElementById("blResponse");
const blWordCount = document.getElementById("blWordCount");


const supported = /^[ -~¡¢£¥§¨©ª«®¯°´¶·¸º»¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿıŁłŒœŠšŸŽžƒˆˇ˘˙˚˛˜˝–—‘’‚“”„†‡•…‰‹›⁄™ﬁﬂ]+$/; //thanks losered
//Font supported: ¡¢£¥§¨©ª«®¯°´¶·¸º»¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿıŁłŒœŠšŸŽžƒˆˇ˘˙˚˛˜˝–—‘’‚“”„†‡•…‰‹›⁄™ﬁﬂ

var count = 0;

//Word Counter (and acronym checker)
function getWordCount(stri) {
    const words = stri.split(" ");
    let wordCount = 0;
    for (const word of words) {
        let hasAlphanum = false;
        for (const ch of word) {
            if (/^[0-9A-Za-z]+$/.test(ch)) {
                hasAlphanum = true;
                break;
            } else {
            }
                
        }
        if (hasAlphanum) {
            wordCount += 1;
        }
    }
    return wordCount;
}

function getAcronym(stri) {
    const words = stri.split(" ");
    const firstLetters = [];
  
    for (const word of words) {
      let trimmed = word.replace(/\W/g, ''); //remove non-alphanumeric so that punctuation isnt accounted for
      
      let firstLetter = trimmed.charAt(0);
      firstLetters.push(firstLetter);
    }
    
    let joined = firstLetters.join('');
    return joined.toUpperCase();
}

function getReverseAcronym(stri) {
    const words = stri.split(" ");
    const lastLetters = [];
  
    for (const word of words) {
      let trimmed = word.replace(/\W/g, ''); //remove non-alphanumeric so that punctuation isnt accounted for
      
      let lastLetter = trimmed.charAt(trimmed.length - 1);
      lastLetters.push(lastLetter);
    }
    
    let joined = lastLetters.join('');
    return joined.toUpperCase();
}

//Meta Checker
function checkMeta(stri) { //Credit to Snoozingnewt for calculating the whole thing. Took a page from losered's book and converted the formulas to js
    let metaScore = 0;
  
    //Verbosity
    let len = stri.length;

    if (len < 49) {
        metaScore += -20;
    }
    if (len <= 63) {
        metaScore += -50 + (len / 63) * 50;
    } else if (len < 84) {
        metaScore += (len - 63) * 20 / 21;
    } else if (len < 110) {
        metaScore += 20 - (len - 84) * 20 / 26;
    } else if (len < 125) {
        metaScore += 0 - (len - 110) * 50 / 15;
    } else {
        metaScore += -50;
    }
    
    //Ellipses
    const countOccurrences = (str, char) => (str.split(char).length - 1);

    let dotCount = countOccurrences(stri, ".");
    let ellipsisCount = countOccurrences(stri, "…");

    if (dotCount >= 3 || ellipsisCount >= 1) {
        metaScore += 20;
    } else {
        metaScore += 0;
    }
    
    //Exclamation Marks
    let exclamationCount = countOccurrences(stri, "!");

    if (exclamationCount) {
        metaScore += 20 / exclamationCount;
    } else {
        metaScore += 0;
    }
    
    //Quotation Marks
    const containsQuote = stri.includes('"') || stri.includes('”');
    metaScore += containsQuote ? 20 : 0;
    
    //Comma
    metaScore += stri.includes(',') ? 5 : 0;
    
    //Dashes
    const containsDash = stri.includes('–') || stri.includes('—') || stri.includes('-');
    metaScore += containsDash ? 10 : 0;
    
    //Ending Penalty
    const regex = /[A-Za-z0-9]$/;
    metaScore += regex.test(stri) ? -30 : 0;
    
    //Punctuation
    const punctuationCount = stri.replace(/[^!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "").length;
    metaScore += punctuationCount < 3 ? -20 : 0;
    
    //Sentence Count
    const countSentences = (stri) => {
        const sentenceEndings = ["\\. ", "\\? ", "\\! "];
        const regex = new RegExp(sentenceEndings.join("|"), "g");
        const matches = stri.match(regex);
        const count = matches ? matches.length : 0;
        return count + 1;
    };
    let sc = countSentences(stri);
    
    if (sc === 1) {
        metaScore += -10;
    } else if (sc === 2) {
        metaScore += 0;
    } else if (sc === 3) {
        metaScore += 10;
    } else {
        metaScore += 0;
    }
    
    //Capitalization
    const upperCaseCount = (stri.match(/[A-Z]/g) || []).length;
    const totalLetterCount = (stri.match(/[A-Za-z]/g) || []).length;
    
    metaScore += upperCaseCount > (totalLetterCount / 4) ? -20 : 0;
    
    //Word Count
    //Just plug in Cary's thing that I already used LOL
    
    let wCount = getWordCount(stri);
    if (wCount < 3) {
        metaScore += -70;
    } else if (wCount < 10) {
        metaScore += -50;
    } else if (wCount === 10) {
        metaScore += -20;
    } else if (wCount === 11) {
        metaScore += 0;
    } else if (wCount === 12) {
        metaScore += -100;
    } else {
        metaScore += -200;
    }
    
    //First Sentence
    const match = stri.match(/^[^.?!]*[.?!] /);
    const firstSentence = match ? match[0] : stri;
    const wCount2 = firstSentence.split(" ").filter(word => word.length > 0).length;

    metaScore += wCount2 < 3 ? 20 : 0;

    return metaScore;
}

//Main Function

function verifyResponse() {
  //This will go through each word and 1. remove non-ASCII characters and 2. give an acronym
  let text = element.value;
  let length = text.length;
  
  let count = getWordCount(text);
  
  let ac = getAcronym(text);
  let rac = getReverseAcronym(text);
  let meta = checkMeta(text);
  
  wordCount.innerHTML = count;
  verbosity.innerHTML = length;
  acronym.innerHTML = ac;
  revAcronym.innerHTML = rac;
  metaScorer.innerHTML = meta;
  
  //check response validity
  if (!text) {
    console.log("no response");
  } else if (!supported.test(text)) {
      asciiChecker.innerHTML = "INVALID! Contains one or more unsupported characters.";
      asciiChecker.style.color = "red";
      quippy.src = "quippyscream.webp";
  } else if (count > 11) {
      asciiChecker.innerHTML = "INVALID! Over 11 words";
      asciiChecker.style.color = "red";
      quippy.src = "quippyscream.webp";
  } else if (count < 11) {
      asciiChecker.innerHTML = "VALID! Stay cautious...";
      asciiChecker.style.color = "yellow";
      quippy.src = "quippybeam.webp";
  } else {
      asciiChecker.innerHTML = "VALID!";
      asciiChecker.style.color = "lime";
      quippy.src = "quippybeam.webp";
  }
  
  //previews
  vsWordCount.innerHTML = count;
  vsResponse.innerHTML = text;
  blWordCount.innerHTML = count;
  blResponse.innerHTML = text;
  
  
  //wordCount.innerHTML = words.toString(); (This should be used as a troubleshooter if things are err uhh fucking up)
}

document.onkeyup = function(){
  if (document.activeElement == element) {
    verifyResponse();
  }
};
