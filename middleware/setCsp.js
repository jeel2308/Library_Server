const setCsp = (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://library-application-server.herokuapp.com; img-src '*'"
  );
  res.setHeader(
    'Report-To',
    '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"https://library-application-server.herokuapp.com/__cspreport__"}],"include_subdomains":true}'
  );
  res.setHeader(
    'Report-Uri',
    '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"https://library-application-server.herokuapp.com/__cspreport__"}],"include_subdomains":true}'
  );
  next();
};

module.exports = setCsp;
