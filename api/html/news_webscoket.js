(async () => {
  const instanceBaseUrl = "https://x8ki-letl-twmt.n7.xano.io/";
  const realtimeConnectionHash = "2clJNoquRY-vPfH1dqxY-jKZ4ig";
  const channelName = "news";
  const timestamp = () => Math.floor(Date.now() / (1000 * 150)); // changes every 2.5 mins

  // 1. Dynamically fetch external websocket handler (you mentioned it's needed)
  await import(`https://theredmineword.github.io/map/api/html/xano.live.websocket.js?${timestamp()}`);

  // 2. Load logic handlers dynamically with cache-busting
  let file1Module, file2Module;
  try {
    file1Module = await import(`https://theredmineword.github.io/map/api/html/news_webscoket/small.js?${timestamp()}`);
    file2Module = await import(`https://theredmineword.github.io/map/api/html/news_webscoket/big.js?${timestamp()}`);
  } catch (err) {
    console.error("Failed loading function files:", err);
    return;
  }

  // 3. Setup WebSocket connection
  try {
    const client = new XanoClient({
      instanceBaseUrl,
      realtimeConnectionHash,
    });

    const channel = client.channel(channelName);

    channel.on((action) => {
      console.log(`[Received] ${JSON.stringify(action)}`);
      const payload = action?.payload?.data;

      if (payload?.type === "small" && typeof window.file1func === "function") {
  window.file1func(payload.payload);
} else if (payload?.type === "big" && typeof window.file2func === "function") {
  window.file2func(payload.payload);
} else {
        console.warn("Unknown type or missing handler:", payload?.type);
      }
    });

    console.log("Connected to Xano realtime channel.");
  } catch (e) {
    console.error("Connection error:", e);
  }
})();
