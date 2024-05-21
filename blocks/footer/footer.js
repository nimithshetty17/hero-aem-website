import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata("footer");
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : "/footer";
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = "";
  const footer = document.createElement("div");
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const footerLinks = footer.querySelectorAll(".footer-links > div p");
  buttonClassRemover(footerLinks);

  block.append(footer);
}

const buttonClassRemover = (listOfPara) => {
  if (listOfPara) {
    listOfPara.forEach((fLink) => {
      fLink.classList.remove("button-container");

      const linkAnchor = fLink.querySelector("a");
      if (linkAnchor) linkAnchor.classList.remove("button");
    });
  }
};
