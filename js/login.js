const CLIENT_ID =
  '572714378239-n9ehsn5a63c5f5n3j9d7an23501plk10.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'AIzaSyB-_-LzgtffIyDFHdFDuSXlExyS27-SmmY';
const SCOPE_YOUTUBE = 'https://www.googleapis.com/auth/youtube.readonly';
const SCOPE_YT_ANALYTICS =
  'https://www.googleapis.com/auth/yt-analytics.readonly';
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

const videoTable = document.getElementById('content-table');

/**
 * Sample JavaScript code for youtube.channels.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/guides/code_samples#javascript
 */

function authenticate() {
  return gapi.auth2
    .getAuthInstance()
    .signIn({ scope: SCOPE_YOUTUBE + ' ' + SCOPE_YT_ANALYTICS })
    .then(
      function() {
        console.log('Sign-in successful');
      },
      function(err) {
        console.error('Error signing in', err);
      }
    );
}

function loadClient() {
  gapi.client.setApiKey(GOOGLE_API_KEY);
  return gapi.client
    .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
    .then(
      function() {
        execute();
        loadClientAnalytics();
        console.log('GAPI client loaded for API');
      },
      function(err) {
        console.error('Error loading GAPI client for API', err);
      }
    );
}

function loadClientAnalytics() {
  return gapi.client
    .load('https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2')
    .then(
      function() {
        executeAnalytics();
        console.log('GAPI client loaded for API');
      },
      function(err) {
        console.error('Error loading GAPI client for API', err);
      }
    );
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.youtube.channels
    .list({
      part: 'snippet,contentDetails,statistics',
      id: CHANNEL_ID
    })
    .then(
      function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log('Response youtube', response);
      },
      function(err) {
        console.error('Execute error', err);
      }
    );
}

function executeAnalytics() {
  return gapi.client.youtubeAnalytics.reports
    .query({
      ids: 'channel==MINE',
      startDate: '2019-01-01',
      endDate: '2019-12-31',
      metrics:
        'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage',
      dimensions: 'day',
      sort: 'day'
    })
    .then(
      function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log('Response analytics', response);
      },
      function(err) {
        console.error('Execute error', err);
      }
    );
}

gapi.load('client:auth2', function() {
  gapi.auth2.init({ client_id: CLIENT_ID });
});

const showContents = () => {
  const playListItems = response.result.items;
  if (playListItems) {
    let content = '';
    playListItems.map(playListItem => {
      const videoId = playListItem.id;
      content += `
            <tr>
              <td>
                <iframe width="200" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </td>
              <td>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <input type="checkbox" id="${videoId}">
                    </div>
                  </div>
                  <input type="text" class="form-control" aria-label="Text input with checkbox">
                </div>
              </td>
            <tr>
            `;
    });
    videoTable.innerHTML = content;
  } else {
    videoTable.innerHTML = `<h5> No vidoe found <h5>`;
  }
};
