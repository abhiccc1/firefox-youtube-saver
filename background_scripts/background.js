// Background script for YouTube Video Saver

// Listen for installation of the extension
browser.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
      // Initialize storage with empty savedVideos array
      browser.storage.local.set({
        savedVideos: []
      }).then(() => {
        console.log("YouTube Video Saver initialized with empty storage.");
      });
    }
  });
  
  // Optional: Add context menu for saving videos
  browser.contextMenus.create({
    id: "save-youtube-video",
    title: "Save this YouTube video",
    contexts: ["page"],
    documentUrlPatterns: ["*://*.youtube.com/watch*"]
  });
  
  browser.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "save-youtube-video") {
      // Send message to content script to get video info
      browser.tabs.sendMessage(tab.id, {action: "getVideoInfo"})
        .then(videoInfo => {
          if (videoInfo) {
            // Save the video information
            saveVideoFromBackground(videoInfo);
          }
        })
        .catch(error => {
          console.error("Error saving video via context menu:", error);
        });
    }
  });
  
  // Function to save video from background script
  function saveVideoFromBackground(videoInfo) {
    browser.storage.local.get('savedVideos')
      .then(result => {
        let savedVideos = result.savedVideos || [];
        
        // Check if video is already saved
        const isDuplicate = savedVideos.some(video => video.id === videoInfo.id);
        
        if (!isDuplicate) {
          // Add new video to the beginning of the array
          savedVideos.unshift({
            id: videoInfo.id,
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            description: videoInfo.description,
            url: videoInfo.url,
            dateAdded: new Date().toISOString()
          });
          
          // Save back to storage
          return browser.storage.local.set({
            savedVideos: savedVideos
          });
        }
      })
      .then(() => {
        // Show notification
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.extension.getURL("icons/icon-48.png"),
          title: "YouTube Video Saver",
          message: "Video saved successfully!"
        });
      })
      .catch(error => {
        console.error("Error saving video from background:", error);
      });
  }