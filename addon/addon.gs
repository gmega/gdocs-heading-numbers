const LEVEL_REGEX = /HEADING(?<level>[0-9]+)/
const HEADING_NUMBER = /^([0-9]+\.)+\s?/

function onOpen() {  
  DocumentApp.getUi()
    .createMenu('Headings Tools')
    .addItem('Add Heading Numbering', 'addHeadingNumbers')
    .addItem('Clear Heading Numbering', 'clearHeadingNumbers')
    .addToUi();
}

function addHeadingNumbers() {
  // Gotta clear them first.
  clearHeadingNumbers()
  
  let paragraphs = DocumentApp
     .getActiveDocument()
     .getBody()
     .getParagraphs()
  
  let levelStack = [0]
  
  for (i in paragraphs) {
    let paragraph = paragraphs[i]
    let level = getHeadingLevel(paragraph)
    if (level == -1) {
      continue
    }
    
    updateCounter(levelStack, level)
    paragraph.setText(`${levelStack.join('.')}. ${paragraph.getText()}`)
  }
}

function clearHeadingNumbers() {
  let paragraphs = DocumentApp
     .getActiveDocument()
     .getBody()
     .getParagraphs()

  for (i in paragraphs) {
    paragraph = paragraphs[i]
    if (getHeadingLevel(paragraph) != -1) {
      // Clearly this will also clear manually entered heading numbers, but 
      // I wouldn't know how to do otherwise.
      paragraph.setText(paragraph.getText().replace(HEADING_NUMBER, ''))
    }
  }  
}

function getHeadingLevel(paragraph) {
  let heading = LEVEL_REGEX.exec(paragraph.getHeading().toString())
  return heading === null ? -1 : parseInt(heading.groups['level'])
}

function updateCounter(levelStack, level) {
  let actualLevel = levelStack.length
  while (actualLevel != level) {
    if (actualLevel > level) {
      // Somewhat inefficient, but encodes the current level
      // as the size of the stack.
      levelStack.pop()
      actualLevel--
    }
    
    if (actualLevel < level) {
      levelStack.push(0)
      actualLevel++
    }   
  }
  
  levelStack[level - 1]++
}