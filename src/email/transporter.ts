import "dotenv/config";
import nodemailer from "nodemailer";
import aws from "aws-sdk";
import templates from "./templates";
import type { Attachment } from "nodemailer/lib/mailer";

const {
  AWS_SES_ACCESS_KEY_ID,
  AWS_SES_SECRET_ACCESS_KEY,
  AWS_REGION,
  MAIL_DOMAIN
} = process.env;

const SES_CONFIG = {
  accessKeyId: AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: AWS_SES_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  sslEnabled: true
};

const ses = new aws.SES(SES_CONFIG);

let transporter = nodemailer.createTransport({
  SES: { ses, aws },
  sendingRate: 1
});

interface EmailOptions {
  name?: string;
  user?: string;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
}

const defaultOptions: EmailOptions = {
  name: "Kakapo",
  user: "no-reply",
  subject: "Kakapo Social Update"
};

/**
 * Send an email with the given options
 *
 * @param to Email recipient(s)
 * @param options Additional email options
 */
const sendEmail = async (to: string | string[], options: EmailOptions) => {
  options = { ...defaultOptions, ...options };

  await transporter.sendMail({
    from: {
      name: options.name,
      address: `${options.user}@${MAIL_DOMAIN}`
    },
    to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments
  });

  // TODO: Test
};

/**
 * Render from a template and send an email
 *
 * @param to Email recipient(s)
 * @param template Email template name
 * @param templateContext Context to pass to the template
 * @param options Additional email options
 */
const sendTemplate = async (
  to: string | string[],
  template: string,
  templateContext: any,
  options: EmailOptions
) => {
  const loadedTemplate = templates[template];
  const html = loadedTemplate.render(templateContext);
  const text = loadedTemplate.fallback(templateContext);

  await sendEmail(to, {
    ...options,
    html,
    text,
    attachments: templates[template].assets
  });

  // TODO: Test
};

export { sendEmail, sendTemplate };
