import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import scooterDOMTransform from '../../scripts/helper-scripts/scooterDOMTransform.js';
import motorcycleDOMTransform from '../../scripts/helper-scripts/motorcycleDOMTransform.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector("[aria-expanded='true']");
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')){
          navSection.classList.add('nav-drop');
        }
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded =
              navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true'
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type='button' aria-controls='nav' aria-label='Open navigation'>
      <span class='nav-hamburger-icon'></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () =>
    toggleMenu(nav, navSections, isDesktop.matches)
  );

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
  //custom script for dom manipulation in header
  let header = document.querySelector('header');

  if (header) {
    let containers = document.querySelectorAll(
      '.section.fragment-container.nav-sections'
    );

    containers.forEach(function (container) {
      let defaultContentDivs = container.querySelectorAll(
        '.default-content-wrapper'
      );

      // Filter divs that contain <ul><li></li></ul>
      const filteredDivs = [];
      defaultContentDivs.forEach(function (div) {
        const ulElement = div.querySelector('ul');
        if (ulElement && ulElement.querySelector('li')) {
          filteredDivs.push(div);
        }
      });

      // If we have at least two divs that match the criteria
      if (filteredDivs.length >= 2) {
        const firstDiv = filteredDivs[0];

        // Ensure the first div has a <ul> element to insert <li> elements into
        let ulElementInFirstDiv = firstDiv.querySelector('ul');
        if (!ulElementInFirstDiv) {
          ulElementInFirstDiv = document.createElement('ul');
          firstDiv.appendChild(ulElementInFirstDiv);
        }

        // Process divs from the 2nd to the Nth
        for (let i = 1; i < filteredDivs.length; i++) {
          const currentDiv = filteredDivs[i];
          const ulElementInCurrentDiv = currentDiv.querySelector('ul');
          const liElements = ulElementInCurrentDiv.querySelectorAll('li');

          // Insert each <li> element into the first div's <ul>
          liElements.forEach(function (li) {
            ulElementInFirstDiv.appendChild(li);
          });

          // Remove the current div after transferring the <li> elements
          currentDiv.remove();
        }

        // Add attributes to all <li> tags inside the first .default-content-wrapper
        const liElementsInFirstDiv = ulElementInFirstDiv.querySelectorAll('li');
        liElementsInFirstDiv.forEach(function (li) {
          li.classList.add('nav-drop');
          li.setAttribute('tabindex', '0');
          li.setAttribute('aria-expanded', 'false');
        });
      }

      // Find fragment-wrapper divs
      const fragmentWrapperDivs = container.querySelectorAll('.fragment-wrapper');
      const liElementsInDefaultWrapper = container.querySelectorAll(
        '.default-content-wrapper li'
      );

      // Transfer fragment-wrapper divs to respective li tags
      fragmentWrapperDivs.forEach(function (fragmentWrapper, index) {
        if (liElementsInDefaultWrapper[index]) {
          const newUl = document.createElement('ul');
          const newLi = document.createElement('li');
          newLi.appendChild(fragmentWrapper);
          newUl.appendChild(newLi);
          liElementsInDefaultWrapper[index].appendChild(newUl);
        }
      });
    });
  } else {
    console.log('No header element found.');
  }
//function to transform the dom structure for scooters
scooterDOMTransform();
//function to transform the dom structure for motorcycle
motorcycleDOMTransform();
}