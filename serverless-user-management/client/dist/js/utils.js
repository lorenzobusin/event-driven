//define API link
const linkAPI_POST = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/pusheventusertosqs";
const linkAPI_GET = "https://2ont8yn0k4.execute-api.eu-central-1.amazonaws.com/dev/getUser?userId=";

function generateUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
