// Usage example:
// <script src="http://localhost:3002/chat.js?assistantId=asst_oJrC27sd2gGNy2gC702We2K0" async></script>

const main = () => {
  const scriptURL = new URL(document.currentScript.src);
  const urlParams = scriptURL.searchParams;
  const assistantId = urlParams.get('assistantId');
  const baseUrl = `${scriptURL.protocol}//${scriptURL.host}`;

  const load = () => {
    let container = document.createElement('div');
    container.id = 'askflow-container';
    document.body.appendChild(container);

    container.addEventListener(
      'touchmove',
      function (e) {
        e.preventDefault();
      },
      false,
    );
    container.addEventListener(
      'scroll',
      function (e) {
        e.preventDefault();
      },
      false,
    );

    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}?assistantId=${assistantId}`;
    iframe.id = 'askflowChatIframe';
    iframe.allowfullscreen = true;

    container.appendChild(iframe);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = baseUrl + '/style.css';
    document.body.appendChild(link);
  };
  if (document.readyState === 'complete') {
    load();
  } else if (window.attachEvent) {
    window.attachEvent('onload', load);
  } else {
    window.addEventListener('load', load, false);
  }
};

const getBaseUrl = () => {
  const scriptURL = new URL(document.currentScript.src);
  return `${scriptURL.protocol}//${scriptURL.host}`;
};

main();
