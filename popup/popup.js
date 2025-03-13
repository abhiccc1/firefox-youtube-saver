// Initialize the popup page
document.addEventListener('DOMContentLoaded', function() {
    // Setup the "Add Video" button
    const addButton = document.getElementById('add-video');
    addButton.addEventListener('click', addCurrentVideo);
    
    // Load and display saved videos
    loadSavedVideos();
  });
  
  // Function to add the current video
  function addCurrentVideo() {
    // Query for the active tab
    browser.tabs.query({active: true, currentWindow: true})
      .then(tabs => {
        const activeTab = tabs[0];
        
        // Check if we're on a YouTube video page
        if (activeTab.url.includes('youtube.com/watch')) {
          // Send message to the content script to get video information
          browser.tabs.sendMessage(activeTab.id, {action: "getVideoInfo"})
            .then(videoInfo => {
              if (videoInfo) {
                saveVideo(videoInfo);
              } else {
                showMessage("Could not retrieve video information.");
              }
            })
            .catch(error => {
              showMessage("Error: " + error.message);
            });
        } else {
          showMessage("Please navigate to a YouTube video page first.");
        }
      });
  }
  
  // Function to save a video to storage
  function saveVideo(videoInfo) {
    // Get currently saved videos
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
        } else {
          showMessage("This video is already in your saved list.");
        }
      })
      .then(() => {
        // Refresh the displayed videos
        loadSavedVideos();
        showMessage("Video saved successfully!");
      })
      .catch(error => {
        showMessage("Error saving video: " + error.message);
      });
  }
  
  // Function to load and display saved videos
  function loadSavedVideos() {
    browser.storage.local.get('savedVideos')
      .then(result => {
        const savedVideos = result.savedVideos || [];
        const savedVideosContainer = document.getElementById('saved-videos');
        const noVideosMessage = document.getElementById('no-videos');
        
        // Clear current content
        savedVideosContainer.innerHTML = '';
        
        if (savedVideos.length === 0) {
          // Show message if no videos saved
          noVideosMessage.style.display = 'block';
          savedVideosContainer.style.display = 'none';
        } else {
          // Hide message and show videos
          noVideosMessage.style.display = 'none';
          savedVideosContainer.style.display = 'block';
          
          // Create elements for each saved video
          savedVideos.forEach((video, index) => {
            const videoElement = createVideoElement(video, index);
            savedVideosContainer.appendChild(videoElement);
          });
        }
      })
      .catch(error => {
        showMessage("Error loading videos: " + error.message);
      });
  }
  
  // Function to create HTML element for a video
  function createVideoElement(video, index) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    
    videoItem.innerHTML = `
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}">
      </div>
      <div class="video-info">
        <div class="video-title">${video.title}</div>
        <div class="video-description">${video.description || ''}</div>
        <div class="video-actions">
          <span class="video-action watch" data-url="${video.url}">Watch</span>
          <span class="video-action remove" data-index="${index}">Remove</span>
        </div>
      </div>
    `;
    
    // Add event listeners for actions
    videoItem.querySelector('.watch').addEventListener('click', function() {
      const url = this.getAttribute('data-url');
      browser.tabs.create({url: url});
    });
    
    videoItem.querySelector('.remove').addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      removeVideo(index);
    });
    
    return videoItem;
  }
  
  // Function to remove a video
  function removeVideo(index) {
    browser.storage.local.get('savedVideos')
      .then(result => {
        let savedVideos = result.savedVideos || [];
        
        // Remove video at the specified index
        if (index >= 0 && index < savedVideos.length) {
          savedVideos.splice(index, 1);
          
          // Save back to storage
          return browser.storage.local.set({
            savedVideos: savedVideos
          });
        }
      })
      .then(() => {
        // Refresh the displayed videos
        loadSavedVideos();
        showMessage("Video removed.");
      })
      .catch(error => {
        showMessage("Error removing video: " + error.message);
      });
  }
  
  // Function to show a temporary message
  function showMessage(message) {
    // Check if a message element already exists
    let messageElement = document.getElementById('message');
    
    if (!messageElement) {
      // Create a new message element
      messageElement = document.createElement('div');
      messageElement.id = 'message';
      messageElement.style.position = 'fixed';
      messageElement.style.top = '10px';
      messageElement.style.left = '50%';
      messageElement.style.transform = 'translateX(-50%)';
      messageElement.style.padding = '8px 16px';
      messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      messageElement.style.color = 'white';
      messageElement.style.borderRadius = '4px';
      messageElement.style.zIndex = '1000';
      document.body.appendChild(messageElement);
    }
    
    // Set message and show
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 3000);
  }