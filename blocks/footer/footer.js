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

  const footerLinks = footer.querySelectorAll(
    ".footer-links > div:first-of-type p"
  );

  footerLinks.forEach((fLink) => {
    fLink.classList.remove("button-container");

    let linkAnchor = fLink.querySelector("a");
    linkAnchor.classList.remove("button");
    // linkAnchor.classList.add("footer-upper-link");
  });

  console.log("footerLinks: ", footerLinks);

  block.append(footer);

  console.log("main log: ", block, footer);
}
