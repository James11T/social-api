import fs from "fs";
import handlebars, { TemplateDelegate } from "handlebars";
import { stripFileExtention } from "../utils/strings";
import type { Attachment } from "nodemailer/lib/mailer";

const NO_FALLBACK =
  "This email is HTML only. If you can't see the HTML version of this email then you may need to update your email client preferences.";

const TEMPLATE_DIR = "src/email/views/";

interface APITemplate {
  render: TemplateDelegate;
  fallback: TemplateDelegate;
  assets: Attachment[];
}

interface Templates {
  [key: string]: APITemplate;
}

/**
 * Load the text fallback for a HTML email template
 * If one does not exist then return the default fallback
 *
 * @param dirName Template directory name
 * @returns Fallback template function
 */
const loadFallback = (dirName: string) => {
  let fallback: string;
  try {
    fallback = fs.readFileSync(
      `${TEMPLATE_DIR}${dirName}/fallback.txt`,
      "utf8"
    );
  } catch (error) {
    fallback = NO_FALLBACK;
  }

  return handlebars.compile(fallback);

  // TODO: Test
};

/**
 *  Load a template directory from disk
 *
 * @param dirName Template directory name, must contain template.hbs
 * @returns Template file render function with a list of attachments
 */
const loadTemplate = (dirName: string): APITemplate => {
  const template = fs.readFileSync(
    `${TEMPLATE_DIR}${dirName}/template.hbs`,
    "utf8"
  );

  const render = handlebars.compile(template);
  const fallback = loadFallback(dirName);

  const assets = fs.readdirSync(`${TEMPLATE_DIR}${dirName}/static`).map(
    (file): Attachment => ({
      path: `${TEMPLATE_DIR}${dirName}/static/${file}`,
      filename: file,
      cid: stripFileExtention(file)
    })
  );

  return { render, fallback, assets };

  // TODO: Test
};

/**
 * Load all template files from disk and compile them into usable templates
 *
 * @returns A map of template file names to template functions
 */
const loadTemplates = () => {
  const templates: Templates = {};
  console.log("Loading templates email templates.");

  // Get all directory names in the template directory
  const templateFolders = fs
    .readdirSync(TEMPLATE_DIR, { withFileTypes: true })
    .filter((path) => path.isDirectory());

  templateFolders.forEach((templateDir) => {
    try {
      const template = loadTemplate(templateDir.name);
      templates[templateDir.name] = template;
    } catch (error) {
      console.error(`Failed to load template: ${templateDir.name}`);
    }
  });

  return templates;

  // TODO: Test
};

const templates = loadTemplates();

export default templates;

// LATO and Raleway

// CID to FILE: /"cid:(.+?)"/ -> "static/$1.png"
// FILE to CID: static\/(.+?)\.png -> "cid:$1"
