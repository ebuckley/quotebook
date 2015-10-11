var MockUsers = [
  {username: "jblog", email: "jblog@email.com", password: "password"},
  {username: "ersin", email: "ersinbuckley@gmail.com", password: "password"},
];

var Quotes = [
  {
    content: "YOLO up a storm",
    createdAt: "2015-10-11",
    isDeleted: false,
    userId: 2
  },
  {
    content: "You only live once",
    createdAt: "2015-9-11",
    isDeleted: false,
    userId: 1
  },
  {
    content: 'For there are moments when one can neither think nor feel.  And if one can neither think nor feel, she thought, where is one?',
    createdAt: "2015-10-9",
    isDeleted: false,
    userId: 1
  },
  {
    content: 'You will gain money by an illegal action.',
    createdAt: "2015-10-8",
    isDeleted: false,
    userId: 1
  },
  {
    content: 'You will be imprisoned for contributing your time and skill to a bank robbery.',
    createdAt: "2015-10-7",
    isDeleted: false,
    userId: 2
  },
  {
    content: 'You\'re working under a slight handicap.  You happen to be human.',
    createdAt: "2015-10-1",
    isDeleted: false,
    userId: 1
  },
  {
    content: 'You will gain money by an illegal action.',
    createdAt: "2015-10-8",
    isDeleted: false,
    userId: 2
  },
  {
    content: 'The devil can cite Scripture for his purpose. \r\n -- William Shakespeare, "The Merchant of Venice"',
    createdAt: "2015-10-8",
    isDeleted: false,
    userId: 1
  },
  {
    content: 'You will have domestic happiness and faithful friends.',
    createdAt: "2015-10-8",
    isDeleted: false,
    userId: 2
  }
];

module.exports = function  (app) {
  app.datasources.db.automigrate('User', function (err) {
    if (err) throw err;
    app.models.User.create(MockUsers, function (err) {
      if (err) throw err;
      console.log('created mock users');
    });
  });

  app.datasources.db.automigrate('Quote', function (err) {
    if (err) throw err;

    app.models.Quote.create(Quotes, function  (err) {
      if (err) throw err;
      console.log('created mock quotes');
    })
  })
}