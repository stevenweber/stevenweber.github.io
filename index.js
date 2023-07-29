const ENCODED_PROXY_EMAIL = 'ZGF3bnMub3ZlcnJ1bl8wcEBpY2xvdWQuY29t';
const MAIL_TO_PROTOCOL = 'mailto';

function replaceMailLink() {
  const emailLinkElement = document.getElementById('email');
  const decodedProxyEmail = atob(ENCODED_PROXY_EMAIL);
  emailLinkElement.href = `${MAIL_TO_PROTOCOL}:${decodedProxyEmail}`;
}

replaceMailLink();
