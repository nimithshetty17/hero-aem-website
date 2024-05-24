// Function to transform the provided HTML structure to v1scooter structure
export default function transformDOMForScooter() {
  const fragmentWrappers = document.querySelectorAll('.fragment-wrapper');
  fragmentWrappers.forEach((fragmentWrapper) => {
    const leftSideDataDiv = fragmentWrapper.querySelector('.scooter-left-side-data');
    const rightSideDataDiv = fragmentWrapper.querySelector('.scooter-right-side-data');

    if (!leftSideDataDiv || !rightSideDataDiv) {
      // Skip this fragmentWrapper if it doesn't have both .scooter-left-side-data and .scooter-right-side-data children
      return;
    }

    const leftContentWrappers = leftSideDataDiv.querySelectorAll('.default-content-wrapper');
    const rightContentWrapper = rightSideDataDiv.querySelector('.default-content-wrapper');
    
    if (leftContentWrappers.length === 0 || !rightContentWrapper) {
      console.error('Content wrappers not found');
      return;
    }

    // Create the new v1scooter structure
    const scooterContainer = document.createElement('div');
    scooterContainer.classList.add('scooter-container');

    const leftContainer = document.createElement('div');
    leftContainer.classList.add('scooter-left');
    // Extract h3 
    const header = leftSideDataDiv.querySelector('h3');
    if (header) {
      const headerClone = header.cloneNode(true);
      leftContainer.appendChild(headerClone);
    }

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('scooter-right');

    // Process each default-content-wrapper on the left side
    leftContentWrappers.forEach((wrapper) => {
      const paragraphs = wrapper.querySelectorAll('p');
      if (paragraphs.length === 0) {
        console.error('No paragraphs found in wrapper');
        return;
      }

      paragraphs.forEach((paragraph) => {
        const picture = paragraph.querySelector('picture');
        if (!picture) {
          console.error('Picture not found in paragraph');
          return;
        }

        const img = picture.querySelector('img');
        if (!img) {
          console.error('Image not found in picture');
          return;
        }

        // Extract text without <br> tags
        const text = paragraph.innerText.trim().split('\n').filter((line) => line);

        // Left side scooters
        const scooterItem = document.createElement('div');
        scooterItem.classList.add('scooter-item');

        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        imgElement.style.maxWidth = '150px';
        imgElement.style.maxHeight = '160px';

        const textElement = document.createElement('p');
        textElement.innerHTML = text.join(' ');
        scooterItem.appendChild(imgElement);
        scooterItem.appendChild(textElement);
        const anchor = wrapper.querySelector('a');
        if (anchor) {
          const anchorElement = document.createElement('a');
          anchorElement.href = anchor.href;
          anchorElement.title = anchor.title;
          anchorElement.className = 'scooter-link';
          anchorElement.appendChild(scooterItem);
          leftContainer.appendChild(anchorElement);
        } else {
          leftContainer.appendChild(scooterItem);
        }
      });
    });

    // Process the right side banner and the link
    const rightParagraph = rightContentWrapper.querySelector('p');
    if (rightParagraph) {
      const rightPicture = rightParagraph.querySelector('picture');
      if (rightPicture) {
        const rightImg = rightPicture.querySelector('img');
        if (rightImg) {
          const rightImgElement = document.createElement('img');
          rightImgElement.src = rightImg.src;
          rightImgElement.alt = rightImg.alt;
          rightImgElement.style.width = '100%';
          rightImgElement.style.height = 'auto';
          rightContainer.appendChild(rightImgElement);
        }
      }
    }

    const link = rightContentWrapper.querySelector('.button-container a');
    if (link) {
      const linkElement = document.createElement('a');
      linkElement.href = link.href;
      linkElement.title = link.title;
      linkElement.className = link.className;
      linkElement.innerText = link.innerText;
      rightContainer.appendChild(linkElement);
    }

    // Append the left and right containers to the main container
    scooterContainer.appendChild(leftContainer);
    scooterContainer.appendChild(rightContainer);

    // Replace the old structure with the new one
    fragmentWrapper.innerHTML = '';
    fragmentWrapper.appendChild(scooterContainer);
  });
  }