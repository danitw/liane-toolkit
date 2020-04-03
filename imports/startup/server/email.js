import { Accounts } from "meteor/accounts-base";
import { languages } from "/locales";
import createEmail from "/imports/emails/server/createEmail";

/*
 * Set email env var
 */
const settings = Meteor.settings.email;

if (settings && settings.mail) {
  let protocol = "smtp";
  if (settings.mail.secure) protocol += "s";
  let port = settings.mail.port || 587;
  process.env.MAIL_URL = `${protocol}://${encodeURIComponent(
    settings.mail.username
  )}:${encodeURIComponent(settings.mail.password)}@${
    settings.mail.host
  }:${port}`;
}

/*
 * Set proper site name, from and urls
 */
Accounts.emailTemplates.siteName = Meteor.settings.public.appName;
Accounts.emailTemplates.from = `${Meteor.settings.public.appName} <${Meteor.settings.public.appEmail}>`;
Accounts.urls.verifyEmail = function(token) {
  return Meteor.absoluteUrl("verify-email/" + token);
};
Accounts.urls.resetPassword = function(token) {
  return Meteor.absoluteUrl("reset-password/" + token);
};

/*
 * Reset password templates
 */
let resetPassword = {};
for (const locale in languages) {
  createEmail("resetPassword", locale)
    .then(emailData => {
      resetPassword[locale] = emailData;
    })
    .catch(err => {
      console.log(err);
    });
}

Accounts.emailTemplates.resetPassword = {
  subject(user) {
    const locale = user.language || "en";
    return resetPassword[locale].subject;
  },
  html(user, url) {
    const locale = user.language || "en";
    let body = resetPassword[locale].body;
    body = body.replace("%NAME%", user.name);
    body = body.replace("%URL%", url);
    return body;
  }
};

/*
 * Verify email templates
 */
let verifyEmail = {};
for (const locale in languages) {
  createEmail("verifyEmail", locale)
    .then(emailData => {
      verifyEmail[locale] = emailData;
    })
    .catch(err => {
      console.log(err);
    });
}

Accounts.emailTemplates.verifyEmail = {
  subject(user) {
    const locale = user.language || "en";
    return verifyEmail[locale].subject;
  },
  html(user, url) {
    const locale = user.language || "en";
    let body = verifyEmail[locale].body;
    body = body.replace("%NAME%", user.name);
    body = body.replace("%URL%", url);
    return body;
  }
};
