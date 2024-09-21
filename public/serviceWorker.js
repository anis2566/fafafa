// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);

sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body } = message;
  // const { title, body, sound } = message;

  console.log("Received push message", message);

  async function handlePushEvent() {
    const windowClients = await sw.clients.matchAll({ type: "window" });

    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);

      if (appInForeground) {
        console.log("App is in foreground, don't show notification");
        // windowClients[0].postMessage({ type: "play-sound", sound });
        return;
      }
    }

    await sw.registration.showNotification(title, {
      body,
      icon: "/logo.png",
      badge: "/flowchat_logo.png",
      // data: {
      //   sound,
      // },
    });

    // if (sound) {
    //   const audio = new Audio(sound);
    //   audio.play();
    // }
  }

  event.waitUntil(handlePushEvent());
});
