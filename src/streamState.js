let streamFileStatus = { found: null, message: '' };

function updateStatus(found, message) {
  streamFileStatus.found = found;
  streamFileStatus.message = message;
}

function getStatus() {
  return streamFileStatus;
}

module.exports = { updateStatus, getStatus };