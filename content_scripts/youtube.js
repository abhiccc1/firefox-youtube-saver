// Listen for messages from the popup
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "getVideoInfo") {
      // Extract video information from the YouTube page
      const videoInfo = extractVideoInfo();
      sendResponse(videoInfo);
    }
    return true; // Keep the message channel open for asynchronous response
  });
  
  // Function to extract video information from the current page
  function extractVideoInfo() {
    try {
      // Get video ID from URL
      const url = new URL(window.location.href);
      const videoId = url.searchParams.get('v');
      
      if (!videoId) {
        return null;
      }
      
      // Get video title
      let title = '';
      const titleElement = document.querySelector('h1.title');
      if (titleElement) {
        title = titleElement.textContent.trim();
      } else {
        // Try alternative selectors for title
        const altTitleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
        if (altTitleElement) {
          title = altTitleElement.textContent.trim();
        }
      }
      
      // Get thumbnail URL (highest quality available)
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      
      // Get video description
      let description = '';
      const descriptionElement = document.querySelector('#description-text');
      if (descriptionElement) {
        description = descriptionElement.textContent.trim().substring(0, 150) + '...';
      } else {
        // Try alternative selectors for description
        const altDescElement = document.querySelector('ytd-expander #description');
        if (altDescElement) {
          description = altDescElement.textContent.trim().substring(0, 150) + '...';
        }
      }
      
      return {
        id: videoId,
        title: title,
        thumbnail: thumbnail,
        description: description,
        url: window.location.href
      };
    } catch (error) {
      console.error("Error extracting video info:", error);
      return null;
    }
  }